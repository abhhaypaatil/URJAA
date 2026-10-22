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
	PrimaryGoal              string   `json:"primary_goal,omitempty"`
	SecondaryGoals           []string `json:"secondary_goals,omitempty"`
	WorkoutLocation          string   `json:"workout_location,omitempty"`
	AvailableEquipment       []string `json:"available_equipment,omitempty"`
	PreferredActivities      []string `json:"preferred_activities,omitempty"`
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
	AvatarID                 string   `json:"avatar_id,omitempty"`
	AvatarURL                string   `json:"avatar_url,omitempty"`
	CompanionName            string   `json:"companion_name,omitempty"`
}

type UpdateProfileRequest struct {
	PrimaryGoal              string   `json:"primary_goal,omitempty"`
	SecondaryGoals           []string `json:"secondary_goals,omitempty"`
	WorkoutLocation          string   `json:"workout_location,omitempty"`
	AvailableEquipment       []string `json:"available_equipment,omitempty"`
	PreferredActivities      []string `json:"preferred_activities,omitempty"`
	Name                     string   `json:"name"`
	WellnessGoal             string   `json:"wellness_goal"`
	FitnessLevel             string   `json:"fitness_level"`
	PreferredWorkoutDuration int      `json:"preferred_workout_duration"`
	DietaryPreference        string   `json:"dietary_preference"`
	ExerciseLimitations      []string `json:"exercise_limitations"`
	PCOSPCODMode             bool     `json:"pcos_pcod_mode"`
	AvatarID                 string   `json:"avatar_id,omitempty"`
	AvatarURL                string   `json:"avatar_url,omitempty"`
	CompanionName            string   `json:"companion_name,omitempty"`
}

type UpdatePreferencesRequest struct {
	ThemePreference string `json:"theme_preference"` // system, light, dark
	QuietMode       bool   `json:"quiet_mode"`
	CompanionName   string `json:"companion_name,omitempty"`
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
	if req.PrimaryGoal != "" {
		profile.PrimaryGoal = req.PrimaryGoal
		if profile.WellnessGoal == "" {
			profile.WellnessGoal = req.PrimaryGoal
		}
	}
	if len(req.SecondaryGoals) > 0 {
		profile.SecondaryGoals = req.SecondaryGoals
	}
	if req.WorkoutLocation != "" {
		profile.WorkoutLocation = req.WorkoutLocation
	}
	if len(req.AvailableEquipment) > 0 {
		profile.AvailableEquipment = req.AvailableEquipment
	}
	if len(req.PreferredActivities) > 0 {
		profile.PreferredActivities = req.PreferredActivities
	}
	profile.FitnessLevel = req.FitnessLevel
	profile.PreferredWorkoutDuration = req.PreferredWorkoutDuration
	profile.DietaryPreference = req.DietaryPreference
	profile.ExerciseLimitations = req.ExerciseLimitations
	profile.PCOSPCODMode = req.PCOSPCODMode
	if req.AvatarID != "" {
		profile.AvatarID = req.AvatarID
	}
	if req.AvatarURL != "" {
		profile.AvatarURL = req.AvatarURL
	}
	if req.CompanionName != "" {
		profile.CompanionName = req.CompanionName
	}
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
	if req.PrimaryGoal != "" {
		profile.PrimaryGoal = req.PrimaryGoal
		if req.WellnessGoal == "" {
			profile.WellnessGoal = req.PrimaryGoal
		}
	}
	if len(req.SecondaryGoals) > 0 {
		profile.SecondaryGoals = req.SecondaryGoals
	}
	if req.WorkoutLocation != "" {
		profile.WorkoutLocation = req.WorkoutLocation
	}
	if len(req.AvailableEquipment) > 0 {
		profile.AvailableEquipment = req.AvailableEquipment
	}
	if len(req.PreferredActivities) > 0 {
		profile.PreferredActivities = req.PreferredActivities
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
	if req.AvatarID != "" {
		profile.AvatarID = req.AvatarID
	}
	if req.AvatarURL != "" {
		profile.AvatarURL = req.AvatarURL
	}
	if req.CompanionName != "" {
		profile.CompanionName = req.CompanionName
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
	if req.CompanionName != "" {
		prefs.CompanionName = req.CompanionName
		if profile := h.DB.Storage.Profiles[userID]; profile != nil {
			profile.CompanionName = req.CompanionName
		}
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

// GET /api/v1/profile/export
func (h *Handler) ExportData(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	exportData := map[string]interface{}{
		"user":           h.DB.Storage.Users[userID],
		"profile":        h.DB.Storage.Profiles[userID],
		"preferences":    h.DB.Storage.Preferences[userID],
		"cycle_settings": h.DB.Storage.CycleSettings[userID],
		"cycles":         h.DB.Storage.Cycles[userID],
		"checkins":       h.DB.Storage.Checkins[userID],
		"sessions":       h.DB.Storage.Sessions[userID],
		"exported_at":    time.Now(),
		"disclaimer":     models.MedicalDisclaimer,
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Disposition", "attachment; filename=urjaa_health_export.json")
	models.RespondJSON(w, http.StatusOK, exportData)
}

// POST /api/v1/profile/clear-personalization
func (h *Handler) ClearPersonalization(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	// Reset profile to default gentle baseline while preserving user account, lifetime XP, and level
	if profile := h.DB.Storage.Profiles[userID]; profile != nil {
		profile.ExerciseLimitations = []string{}
		profile.PreferredActivities = []string{}
		profile.UpdatedAt = time.Now()
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"status":  "cleared",
		"message": "Personalization history has been cleared. Baseline recommendations restored.",
	})
}

// DELETE /api/v1/profile
func (h *Handler) DeleteAccount(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	delete(h.DB.Storage.Users, userID)
	delete(h.DB.Storage.Profiles, userID)
	delete(h.DB.Storage.Preferences, userID)
	delete(h.DB.Storage.CycleSettings, userID)
	delete(h.DB.Storage.Cycles, userID)
	delete(h.DB.Storage.Checkins, userID)
	delete(h.DB.Storage.Sessions, userID)
	delete(h.DB.Storage.GamificationStates, userID)
	delete(h.DB.Storage.QuestCompletions, userID)
	delete(h.DB.Storage.MealLogs, userID)

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"status":  "deleted",
		"message": "Your account and all associated health data have been permanently purged.",
	})
}
