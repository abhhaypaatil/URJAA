package auth

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"urjaa-backend/internal/database"
	"urjaa-backend/internal/middleware"
	"urjaa-backend/internal/models"

	"github.com/google/uuid"
)

type Handler struct {
	Service *Service
	DB      *database.DB
}

func NewHandler(svc *Service, db *database.DB) *Handler {
	return &Handler{
		Service: svc,
		DB:      db,
	}
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type TokenResponse struct {
	AccessToken  string              `json:"access_token"`
	RefreshToken string              `json:"refresh_token"`
	User         *models.User        `json:"user"`
	Profile      *models.UserProfile `json:"profile"`
	HasSettings  bool                `json:"has_settings"`
}

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		models.RespondError(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid request body")
		return
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" || req.Password == "" || len(req.Password) < 6 {
		models.RespondError(w, http.StatusBadRequest, "VALIDATION_ERROR", "Valid email and 6+ character password required")
		return
	}

	if req.Name == "" {
		req.Name = "User"
	}

	if _, exists := h.DB.Storage.UsersByEmail[req.Email]; exists {
		models.RespondError(w, http.StatusConflict, "USER_EXISTS", "A user with this email already exists")
		return
	}

	hashedPassword, err := h.Service.HashPassword(req.Password)
	if err != nil {
		models.RespondError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to secure password")
		return
	}

	userID := uuid.New().String()
	user := &models.User{
		ID:           userID,
		Email:        req.Email,
		PasswordHash: hashedPassword,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	profile := &models.UserProfile{
		UserID:                   userID,
		Name:                     req.Name,
		WellnessGoal:             "Better overall health",
		FitnessLevel:             "Beginner",
		PreferredWorkoutDuration: 15,
		DietaryPreference:        "Vegetarian",
		ExerciseLimitations:      []string{},
		PCOSPCODMode:             false,
		UpdatedAt:                time.Now(),
	}

	prefs := &models.UserPreferences{
		UserID:          userID,
		ThemePreference: "system",
		QuietMode:       false,
		NotifyPeriod:    true,
		NotifyCheckin:   true,
		NotifyHydration: true,
		NotifyWorkout:   true,
		NotifyNutrition: true,
		NotifyInsights:  true,
		UpdatedAt:       time.Now(),
	}

	h.DB.Storage.Users[userID] = user
	h.DB.Storage.UsersByEmail[req.Email] = user
	h.DB.Storage.Profiles[userID] = profile
	h.DB.Storage.Preferences[userID] = prefs

	accessToken, err := h.Service.GenerateAccessToken(userID, req.Email)
	if err != nil {
		models.RespondError(w, http.StatusInternalServerError, "TOKEN_ERROR", "Failed to generate token")
		return
	}

	refreshToken, err := h.Service.GenerateRefreshToken(userID)
	if err != nil {
		models.RespondError(w, http.StatusInternalServerError, "TOKEN_ERROR", "Failed to generate refresh token")
		return
	}

	models.RespondJSON(w, http.StatusCreated, TokenResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         user,
		Profile:      profile,
		HasSettings:  false,
	})
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		models.RespondError(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid request body")
		return
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	user := h.DB.Storage.UsersByEmail[req.Email]
	if user == nil || !h.Service.CheckPassword(req.Password, user.PasswordHash) {
		models.RespondError(w, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Invalid email or password")
		return
	}

	profile := h.DB.Storage.Profiles[user.ID]
	settings := h.DB.Storage.CycleSettings[user.ID]

	accessToken, err := h.Service.GenerateAccessToken(user.ID, user.Email)
	if err != nil {
		models.RespondError(w, http.StatusInternalServerError, "TOKEN_ERROR", "Failed to generate access token")
		return
	}

	refreshToken, err := h.Service.GenerateRefreshToken(user.ID)
	if err != nil {
		models.RespondError(w, http.StatusInternalServerError, "TOKEN_ERROR", "Failed to generate refresh token")
		return
	}

	models.RespondJSON(w, http.StatusOK, TokenResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         user,
		Profile:      profile,
		HasSettings:  settings != nil,
	})
}

func (h *Handler) Me(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	user := h.DB.Storage.Users[userID]
	if user == nil {
		models.RespondError(w, http.StatusNotFound, "NOT_FOUND", "User not found")
		return
	}

	profile := h.DB.Storage.Profiles[userID]
	prefs := h.DB.Storage.Preferences[userID]
	settings := h.DB.Storage.CycleSettings[userID]

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"user":         user,
		"profile":      profile,
		"preferences":  prefs,
		"has_settings": settings != nil,
	})
}

func (h *Handler) Refresh(w http.ResponseWriter, r *http.Request) {
	var req struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.RefreshToken == "" {
		models.RespondError(w, http.StatusBadRequest, "BAD_REQUEST", "Missing refresh token")
		return
	}

	userID, err := h.Service.VerifyToken(req.RefreshToken)
	if err != nil {
		models.RespondError(w, http.StatusUnauthorized, "INVALID_TOKEN", "Invalid or expired refresh token")
		return
	}

	user := h.DB.Storage.Users[userID]
	if user == nil {
		models.RespondError(w, http.StatusNotFound, "NOT_FOUND", "User not found")
		return
	}

	accessToken, err := h.Service.GenerateAccessToken(user.ID, user.Email)
	if err != nil {
		models.RespondError(w, http.StatusInternalServerError, "TOKEN_ERROR", "Failed to generate access token")
		return
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"access_token": accessToken,
	})
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	models.RespondJSON(w, http.StatusOK, map[string]string{
		"message": "Logged out successfully",
	})
}
