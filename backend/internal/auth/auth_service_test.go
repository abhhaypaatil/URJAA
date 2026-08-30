package auth

import (
	"testing"
	"urjaa-backend/internal/config"
)

func TestAuth_HashAndJWT(t *testing.T) {
	cfg := config.LoadConfig()
	svc := NewService(cfg)

	pw := "SecretPassword123"
	hash, err := svc.HashPassword(pw)
	if err != nil {
		t.Fatalf("hash error: %v", err)
	}

	if !svc.CheckPassword(pw, hash) {
		t.Errorf("password verification failed")
	}

	if svc.CheckPassword("WrongPassword", hash) {
		t.Errorf("expected false for invalid password")
	}

	token, err := svc.GenerateAccessToken("user-123", "user@example.com")
	if err != nil {
		t.Fatalf("jwt generation error: %v", err)
	}

	parsedID, err := svc.VerifyToken(token)
	if err != nil {
		t.Fatalf("jwt verify error: %v", err)
	}
	if parsedID != "user-123" {
		t.Errorf("expected user-123, got %s", parsedID)
	}
}
