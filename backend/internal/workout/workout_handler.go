package workout

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"urjaa-backend/internal/cycle"
	"urjaa-backend/internal/database"
	"urjaa-backend/internal/middleware"
	"urjaa-backend/internal/models"
	"urjaa-backend/internal/recommendation"

	"github.com/google/uuid"
)

type Handler struct {
	DB             *database.DB
	RecService     *recommendation.Service
	CycleService   *cycle.Service
}

func NewHandler(db *database.DB, recSvc *recommendation.Service, cycleSvc *cycle.Service) *Handler {
	return &Handler{
		DB:           db,
		RecService:   recSvc,
		CycleService: cycleSvc,
	}
}

type StartSessionRequest struct {
	WorkoutID string `json:"workout_id"`
}

type CompleteSessionRequest struct {
	DurationSeconds int     `json:"duration_seconds"`
	CompletionRate  float64 `json:"completion_rate"`
	PerceivedEffort string  `json:"perceived_effort"` // Too easy, Good, Hard
	Status          string  `json:"status"`           // COMPLETED, SKIPPED
}

type ReplaceExerciseRequest struct {
	Reason string `json:"reason"` // easier, harder, quiet, low_impact, no_equipment, knee_friendly
}

// GET /api/v1/workouts/recommended
func (h *Handler) GetRecommended(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	profile := h.DB.Storage.Profiles[userID]
	prefs := h.DB.Storage.Preferences[userID]
	settings := h.DB.Storage.CycleSettings[userID]

	currentPhase := cycle.PhaseMenstrual
	cycleDay := 1
	if settings != nil {
		history := h.DB.Storage.Cycles[userID]
		if pInfo, err := h.CycleService.CalculatePhase(settings, history, time.Now()); err == nil {
			currentPhase = pInfo.CurrentPhase
			cycleDay = pInfo.CycleDay
		}
	}

	today := time.Now().Format("2006-01-02")
	var todayCheckin *models.DailyCheckin
	if userCheckins := h.DB.Storage.Checkins[userID]; userCheckins != nil {
		todayCheckin = userCheckins[today]
	}

	input := recommendation.EngineInput{
		Phase:             currentPhase,
		CycleDay:          cycleDay,
		FitnessLevel:      "Beginner",
		Goal:              "Better overall health",
		PreferredDuration: 15,
		QuietMode:         false,
		DietPreference:    "Vegetarian",
		PCOSMode:          false,
	}

	if profile != nil {
		if profile.FitnessLevel != "" {
			input.FitnessLevel = profile.FitnessLevel
		}
		if profile.WellnessGoal != "" {
			input.Goal = profile.WellnessGoal
		}
		if profile.PreferredWorkoutDuration > 0 {
			input.PreferredDuration = profile.PreferredWorkoutDuration
		}
		if profile.DietaryPreference != "" {
			input.DietPreference = profile.DietaryPreference
		}
		input.PCOSMode = profile.PCOSPCODMode
	}

	if prefs != nil {
		input.QuietMode = prefs.QuietMode
	}

	if todayCheckin != nil {
		input.Energy = todayCheckin.Energy
		input.Mood = todayCheckin.Mood
		input.Bloating = todayCheckin.Bloating
		input.Cramps = todayCheckin.Cramps
		input.Sleep = todayCheckin.Sleep
	}

	rec := h.RecService.GenerateRecommendation(input)
	models.RespondJSON(w, http.StatusOK, rec)
}

// GET /api/v1/workouts
func (h *Handler) ListWorkouts(w http.ResponseWriter, r *http.Request) {
	list := make([]*database.WorkoutRecord, 0)
	for _, wItem := range h.DB.Storage.Workouts {
		list = append(list, wItem)
	}
	models.RespondJSON(w, http.StatusOK, list)
}

// GET /api/v1/workouts/:id
func (h *Handler) GetWorkout(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/workouts/")
	wItem := h.DB.Storage.Workouts[id]
	if wItem == nil {
		models.RespondError(w, http.StatusNotFound, "NOT_FOUND", "Workout not found")
		return
	}
	models.RespondJSON(w, http.StatusOK, wItem)
}

// POST /api/v1/workouts/:id/start
func (h *Handler) StartWorkout(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	workoutID := strings.TrimPrefix(r.URL.Path, "/api/v1/workouts/")
	workoutID = strings.TrimSuffix(workoutID, "/start")

	wItem := h.DB.Storage.Workouts[workoutID]
	wTitle := "Custom Workout"
	if wItem != nil {
		wTitle = wItem.Title
	}

	today := time.Now().Format("2006-01-02")
	sessionID := uuid.New().String()
	session := &database.WorkoutSessionRecord{
		ID:              sessionID,
		UserID:          userID,
		WorkoutID:       workoutID,
		WorkoutTitle:    wTitle,
		Status:          "IN_PROGRESS",
		DurationSeconds: 0,
		CompletionRate:  0,
		ScheduledDate:   today,
		StartedAt:       time.Now(),
	}

	h.DB.Storage.Sessions[userID] = append(h.DB.Storage.Sessions[userID], session)

	models.RespondJSON(w, http.StatusCreated, session)
}

// POST /api/v1/workouts/sessions/:id/complete
func (h *Handler) CompleteSession(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	sessionID := strings.TrimPrefix(r.URL.Path, "/api/v1/workouts/sessions/")
	sessionID = strings.TrimSuffix(sessionID, "/complete")

	var req CompleteSessionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		req.Status = "COMPLETED"
		req.CompletionRate = 1.0
	}

	if req.Status == "" {
		req.Status = "COMPLETED"
	}

	now := time.Now()
	var targetSession *database.WorkoutSessionRecord
	for _, s := range h.DB.Storage.Sessions[userID] {
		if s.ID == sessionID {
			s.Status = req.Status
			s.DurationSeconds = req.DurationSeconds
			s.CompletionRate = req.CompletionRate
			s.PerceivedEffort = req.PerceivedEffort
			s.CompletedAt = &now
			targetSession = s
			break
		}
	}

	if targetSession == nil {
		// Create direct completed session
		targetSession = &database.WorkoutSessionRecord{
			ID:              sessionID,
			UserID:          userID,
			WorkoutID:       "66666666-0000-0000-0000-000000000001",
			WorkoutTitle:    "Guided Workout",
			Status:          req.Status,
			DurationSeconds: req.DurationSeconds,
			CompletionRate:  req.CompletionRate,
			PerceivedEffort: req.PerceivedEffort,
			ScheduledDate:   now.Format("2006-01-02"),
			StartedAt:       now.Add(-time.Duration(req.DurationSeconds) * time.Second),
			CompletedAt:     &now,
		}
		h.DB.Storage.Sessions[userID] = append(h.DB.Storage.Sessions[userID], targetSession)
	}

	// Post-workout rule-based progression adjustment per §8.10
	adjustmentNote := "Great consistency! Your training rhythm is logged."
	if req.PerceivedEffort == "Too easy" {
		adjustmentNote = "Nice work! Next session will slightly increase target reps (+10%) for progression."
	} else if req.PerceivedEffort == "Hard" {
		adjustmentNote = "Well done honoring your effort! Next session will provide gentle pacing and extra rest."
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"session":         targetSession,
		"adjustment_note": adjustmentNote,
		"disclaimer":      models.MedicalDisclaimer,
	})
}

// POST /api/v1/workouts/exercises/:id/replace (Walks progression/regression chains per §8.1/8.7)
func (h *Handler) ReplaceExercise(w http.ResponseWriter, r *http.Request) {
	exerciseID := strings.TrimPrefix(r.URL.Path, "/api/v1/workouts/exercises/")
	exerciseID = strings.TrimSuffix(exerciseID, "/replace")

	var req ReplaceExerciseRequest
	json.NewDecoder(r.Body).Decode(&req)

	currentEx := h.DB.Storage.Exercises[exerciseID]
	if currentEx == nil {
		models.RespondError(w, http.StatusNotFound, "NOT_FOUND", "Exercise not found")
		return
	}

	var replacement *database.ExerciseRecord

	switch strings.ToLower(req.Reason) {
	case "easier":
		if currentEx.RegressionExerciseID != nil {
			replacement = h.DB.Storage.Exercises[*currentEx.RegressionExerciseID]
		}
	case "harder":
		if currentEx.ProgressionExerciseID != nil {
			replacement = h.DB.Storage.Exercises[*currentEx.ProgressionExerciseID]
		}
	case "quiet", "no_jumping":
		for _, ex := range h.DB.Storage.Exercises {
			if ex.ID != currentEx.ID && ex.Category == currentEx.Category && ex.QuietFriendly {
				replacement = ex
				break
			}
		}
	case "low_impact", "knee_friendly":
		for _, ex := range h.DB.Storage.Exercises {
			if ex.ID != currentEx.ID && ex.Category == currentEx.Category && ex.LowImpact {
				replacement = ex
				break
			}
		}
	}

	// Fallback to any alternative in same category
	if replacement == nil {
		for _, ex := range h.DB.Storage.Exercises {
			if ex.ID != currentEx.ID && ex.Category == currentEx.Category {
				replacement = ex
				break
			}
		}
	}

	if replacement == nil {
		replacement = currentEx
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"original_id":  currentEx.ID,
		"replacement":  replacement,
		"reason":       req.Reason,
	})
}
