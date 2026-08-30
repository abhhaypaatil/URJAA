package users

import (
	"encoding/json"
	"net/http"
	"time"

	"urjaa-backend/internal/database"
	"urjaa-backend/internal/middleware"
	"urjaa-backend/internal/models"
)

type Handler struct {
	DB *database.DB
}

func NewHandler(db *database.DB) *Handler {
	return &Handler{DB: db}
}

type OnboardingRequest struct {
	LastPeriodStart          string   `json:"last_period_start"`
	PeriodDuration           int      `json:"period_duration"`
	AvgCycleLength           int      `json:"avg_cycle_length"`
	IsRegular                bool     `json:"is_regular"`
	WellnessGoal             string   `json:"wellness_goal"`
	FitnessLevel             string   `json:"fitness_level"` // default Beginner
	PreferredWorkoutDuration int      `json:"preferred_workout_duration"`
	DietaryPreference        string   `json:"dietary_preference"` // Vegetarian, Eggetarian, Non-vegetarian, Vegan
	ExerciseLimitations      []string `json:"exercise_limitations"`
	PCOSPCODMode             bool     `json:"pcos_pcod_mode"`
}

type UpdateProfileRequest struct {
	Name                     string   `json:"name"`
	WellnessGoal             string   `json:"wellness_goal"`
	FitnessLevel             string   `json:"fitness_level"`
	PreferredWorkoutDuration int      `json:"preferred_workout_duration"`
	DietaryPreference        string   `json:"dietary_preference"`
	ExerciseLimitations      []string `json:"exercise_limitations"`
	PCOSPCODMode             bool     `json:"pcos_pcod_mode"`
}

type UpdatePreferencesRequest struct {
	ThemePreference string `json:"theme_preference"` // system, light, dark
	QuietMode       bool   `json:"quiet_mode"`
	NotifyPeriod    bool   `json:"notify_period"`
	NotifyCheckin   bool   `json:"notify_checkin"`
	NotifyHydration bool   `json:"notify_hydration"`
	NotifyWorkout   bool   `json:"notify_workout"`
	NotifyNutrition bool   `json:"notify_nutrition"`
	NotifyInsights  bool   `json:"notify_insights"`
}

// POST /api/v1/onboarding
func (h *Handler) CompleteOnboarding(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	var req OnboardingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		models.RespondError(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid onboarding data")
		return
	}

	if req.LastPeriodStart == "" {
		req.LastPeriodStart = time.Now().Format("2006-01-02")
	}
	if req.PeriodDuration <= 0 {
		req.PeriodDuration = 5
	}
	if req.AvgCycleLength <= 0 {
		req.AvgCycleLength = 28
	}
	if req.FitnessLevel == "" {
		req.FitnessLevel = "Beginner"
	}
	if req.PreferredWorkoutDuration <= 0 {
		req.PreferredWorkoutDuration = 15
	}
	if req.DietaryPreference == "" {
		req.DietaryPreference = "Vegetarian"
	}

	// Update or create Cycle Settings
	h.DB.Storage.CycleSettings[userID] = &models.CycleSettings{
		UserID:          userID,
		LastPeriodStart: req.LastPeriodStart,
		PeriodDuration:  req.PeriodDuration,
		AvgCycleLength:  req.AvgCycleLength,
		IsRegular:       req.IsRegular,
		UpdatedAt:       time.Now(),
	}

	// Update User Profile
	profile := h.DB.Storage.Profiles[userID]
	if profile == nil {
		profile = &models.UserProfile{UserID: userID, Name: "User"}
		h.DB.Storage.Profiles[userID] = profile
	}
	profile.WellnessGoal = req.WellnessGoal
	profile.FitnessLevel = req.FitnessLevel
	profile.PreferredWorkoutDuration = req.PreferredWorkoutDuration
	profile.DietaryPreference = req.DietaryPreference
	profile.ExerciseLimitations = req.ExerciseLimitations
	profile.PCOSPCODMode = req.PCOSPCODMode
	profile.UpdatedAt = time.Now()

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"message":  "Onboarding completed successfully",
		"profile":  profile,
		"settings": h.DB.Storage.CycleSettings[userID],
	})
}

// GET /api/v1/profile
func (h *Handler) GetProfile(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	profile := h.DB.Storage.Profiles[userID]
	if profile == nil {
		models.RespondError(w, http.StatusNotFound, "NOT_FOUND", "Profile not found")
		return
	}

	models.RespondJSON(w, http.StatusOK, profile)
}

// PUT /api/v1/profile
func (h *Handler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	var req UpdateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		models.RespondError(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid request body")
		return
	}

	profile := h.DB.Storage.Profiles[userID]
	if profile == nil {
		profile = &models.UserProfile{UserID: userID}
		h.DB.Storage.Profiles[userID] = profile
	}

	if req.Name != "" {
		profile.Name = req.Name
	}
	if req.WellnessGoal != "" {
		profile.WellnessGoal = req.WellnessGoal
	}
	if req.FitnessLevel != "" {
		profile.FitnessLevel = req.FitnessLevel
	}
	if req.PreferredWorkoutDuration > 0 {
		profile.PreferredWorkoutDuration = req.PreferredWorkoutDuration
	}
	if req.DietaryPreference != "" {
		profile.DietaryPreference = req.DietaryPreference
	}
	profile.ExerciseLimitations = req.ExerciseLimitations
	profile.PCOSPCODMode = req.PCOSPCODMode
	profile.UpdatedAt = time.Now()

	models.RespondJSON(w, http.StatusOK, profile)
}

// GET /api/v1/settings
func (h *Handler) GetSettings(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	prefs := h.DB.Storage.Preferences[userID]
	cycleSettings := h.DB.Storage.CycleSettings[userID]

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"preferences":    prefs,
		"cycle_settings": cycleSettings,
		"disclaimer":     models.MedicalDisclaimer,
	})
}

// PUT /api/v1/settings
func (h *Handler) UpdateSettings(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	var req UpdatePreferencesRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		models.RespondError(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid request body")
		return
	}

	prefs := h.DB.Storage.Preferences[userID]
	if prefs == nil {
		prefs = &models.UserPreferences{UserID: userID}
		h.DB.Storage.Preferences[userID] = prefs
	}

	if req.ThemePreference != "" {
		prefs.ThemePreference = req.ThemePreference
	}
	prefs.QuietMode = req.QuietMode
	prefs.NotifyPeriod = req.NotifyPeriod
	prefs.NotifyCheckin = req.NotifyCheckin
	prefs.NotifyHydration = req.NotifyHydration
	prefs.NotifyWorkout = req.NotifyWorkout
	prefs.NotifyNutrition = req.NotifyNutrition
	prefs.NotifyInsights = req.NotifyInsights
	prefs.UpdatedAt = time.Now()

	models.RespondJSON(w, http.StatusOK, prefs)
}

// DELETE /api/v1/profile (Privacy & Data deletion per §17)
func (h *Handler) DeleteAccount(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	user := h.DB.Storage.Users[userID]
	if user != nil {
		delete(h.DB.Storage.UsersByEmail, user.Email)
	}
	delete(h.DB.Storage.Users, userID)
	delete(h.DB.Storage.Profiles, userID)
	delete(h.DB.Storage.Preferences, userID)
	delete(h.DB.Storage.CycleSettings, userID)
	delete(h.DB.Storage.Cycles, userID)
	delete(h.DB.Storage.Checkins, userID)
	delete(h.DB.Storage.Sessions, userID)
	delete(h.DB.Storage.MealLogs, userID)

	models.RespondJSON(w, http.StatusOK, map[string]string{
		"message": "Account and all associated health data successfully permanently deleted.",
	})
}

// GET /api/v1/profile/export (Data export per §17)
func (h *Handler) ExportData(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	user := h.DB.Storage.Users[userID]
	profile := h.DB.Storage.Profiles[userID]
	cycleSettings := h.DB.Storage.CycleSettings[userID]
	cycles := h.DB.Storage.Cycles[userID]
	checkins := h.DB.Storage.Checkins[userID]
	sessions := h.DB.Storage.Sessions[userID]

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"export_date":    time.Now(),
		"user":           user,
		"profile":        profile,
		"cycle_settings": cycleSettings,
		"cycle_history":  cycles,
		"checkins":       checkins,
		"workouts":       sessions,
		"disclaimer":     models.MedicalDisclaimer,
	})
}
