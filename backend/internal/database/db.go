package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	_ "github.com/lib/pq"
)

type DB struct {
	SQLDB   *sql.DB
	IsMock  bool
	Storage *MemoryStorage
}

func Connect(dbURL string) (*DB, error) {
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Printf("[DB] Warning: PostgreSQL connection failed (%v). Initializing fallback in-memory datastore.", err)
		return NewMemoryDB(), nil
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Quick ping check
	ctx, cancel := contextWithTimeout(2 * time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		log.Printf("[DB] PostgreSQL not reachable (%v). Initializing robust memory storage for local standalone mode.", err)
		return NewMemoryDB(), nil
	}

	log.Println("[DB] Successfully connected to PostgreSQL.")
	return &DB{SQLDB: db, IsMock: false, Storage: NewMemoryStorage()}, nil
}

func (d *DB) RunMigrations(migrationsDir string) error {
	if d.IsMock {
		log.Println("[DB] Running mock schema initialization...")
		d.Storage.SeedDefaultData()
		return nil
	}

	files, err := os.ReadDir(migrationsDir)
	if err != nil {
		return fmt.Errorf("read migrations dir: %w", err)
	}

	for _, file := range files {
		if strings.HasSuffix(file.Name(), ".sql") {
			content, err := os.ReadFile(filepath.Join(migrationsDir, file.Name()))
			if err != nil {
				return err
			}
			log.Printf("[DB] Applying migration: %s", file.Name())
			if _, err := d.SQLDB.Exec(string(content)); err != nil {
				return fmt.Errorf("migration %s failed: %w", file.Name(), err)
			}
		}
	}
	return nil
}

func (d *DB) RunSeeds(seedsDir string) error {
	if d.IsMock {
		d.Storage.SeedDefaultData()
		return nil
	}

	files, err := os.ReadDir(seedsDir)
	if err != nil {
		return fmt.Errorf("read seeds dir: %w", err)
	}

	for _, file := range files {
		if strings.HasSuffix(file.Name(), ".sql") {
			content, err := os.ReadFile(filepath.Join(seedsDir, file.Name()))
			if err != nil {
				return err
			}
			log.Printf("[DB] Applying seed: %s", file.Name())
			if _, err := d.SQLDB.Exec(string(content)); err != nil {
				log.Printf("[DB] Seed %s notice (continuing): %v", file.Name(), err)
			}
		}
	}
	return nil
}

func NewMemoryDB() *DB {
	mem := NewMemoryStorage()
	mem.SeedDefaultData()
	return &DB{
		IsMock:  true,
		Storage: mem,
	}
}
