package notifications

import (
	"context"
	"log"
)

// Service handles system and wellness reminder notifications.
type Service struct{}

func NewService() *Service {
	return &Service{}
}

func (s *Service) SendReminder(ctx context.Context, userID, notificationType, message string) error {
	log.Printf("[NOTIFICATIONS] Sending %s reminder to user %s: %s", notificationType, userID, message)
	return nil
}
