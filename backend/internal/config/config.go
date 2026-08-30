package config

import (
	"os"
	"time"
)

type Config struct {
	AppEnv         string
	Port           string
	DatabaseURL    string
	JWTSecret      string
	JWTAccessTTL   time.Duration
	JWTRefreshTTL  time.Duration
	FrontendURL    string
	LogLevel       string
}

func LoadConfig() *Config {
	cfg := &Config{
		AppEnv:        getEnv("APP_ENV", "development"),
		Port:          getEnv("PORT", "8080"),
		DatabaseURL:   getEnv("DATABASE_URL", "postgres://postgres:postgrespassword@localhost:5432/urjaa?sslmode=disable"),
		JWTSecret:     getEnv("JWT_SECRET", "urjaa-super-secret-jwt-key-for-development-32bytes-min"),
		JWTAccessTTL:  15 * time.Minute,
		JWTRefreshTTL: 720 * time.Hour, // 30 days
		FrontendURL:   getEnv("FRONTEND_URL", "http://localhost:5173"),
		LogLevel:      getEnv("LOG_LEVEL", "info"),
	}

	return cfg
}

func getEnv(key, defaultVal string) string {
	if val, exists := os.LookupEnv(key); exists && val != "" {
		return val
	}
	return defaultVal
}
