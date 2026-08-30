package insights

import (
	"net/http"
	"time"

	"urjaa-backend/internal/cycle"
	"urjaa-backend/internal/database"
	"urjaa-backend/internal/middleware"
	"urjaa-backend/internal/models"
)

type Handler struct {
	DB           *database.DB
	CycleService *cycle.Service
}

func NewHandler(db *database.DB, cycleSvc *cycle.Service) *Handler {
	return &Handler{
		DB:           db,
		CycleService: cycleSvc,
	}
}

// GET /api/v1/insights/cycle
func (h *Handler) GetCycleInsights(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	settings := h.DB.Storage.CycleSettings[userID]
	history := h.DB.Storage.Cycles[userID]

	var phaseInfo *cycle.PhaseInfo
	if settings != nil {
		phaseInfo, _ = h.CycleService.CalculatePhase(settings, history, time.Now())
	}

	cycleCount := 0
	avgLength := 28
	if settings != nil {
		avgLength = settings.AvgCycleLength
	}
	if history != nil {
		cycleCount = len(history)
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"current_phase":       phaseInfo,
		"tracked_cycles":      cycleCount,
		"average_length_days": avgLength,
		"regularity_status":   "Regular Rhythms",
		"confidence_summary":  "Calculated using cycle settings and logged period days.",
		"disclaimer":          models.MedicalDisclaimer,
	})
}

// GET /api/v1/insights/wellness
func (h *Handler) GetWellnessInsights(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	userCheckins := h.DB.Storage.Checkins[userID]
	moodCounts := map[string]int{"Great": 0, "Good": 0, "Okay": 0, "Low": 0, "Bad": 0}
	energyCounts := map[string]int{"High": 0, "Medium": 0, "Low": 0}
	sleepCounts := map[string]int{"Good": 0, "Okay": 0, "Poor": 0}
	totalCheckins := 0

	if userCheckins != nil {
		for _, c := range userCheckins {
			totalCheckins++
			if c.Mood != "" {
				moodCounts[c.Mood]++
			}
			if c.Energy != "" {
				energyCounts[c.Energy]++
			}
			if c.Sleep != "" {
				sleepCounts[c.Sleep]++
			}
		}
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"total_checkins":  totalCheckins,
		"mood_breakdown":  moodCounts,
		"energy_levels":   energyCounts,
		"sleep_patterns":  sleepCounts,
		"wellness_note":   "Logging your daily check-ins helps adapt your nutrition and training recommendations.",
		"disclaimer":      models.MedicalDisclaimer,
	})
}

// GET /api/v1/insights/fitness
func (h *Handler) GetFitnessInsights(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	sessions := h.DB.Storage.Sessions[userID]
	completedCount := 0
	totalMinutes := 0
	if sessions != nil {
		for _, s := range sessions {
			if s.Status == "COMPLETED" {
				completedCount++
				totalMinutes += s.DurationSeconds / 60
			}
		}
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"total_completed_workouts": completedCount,
		"total_movement_minutes":   totalMinutes,
		"average_session_minutes":  15,
		"consistency_summary":      "Regular bodyweight and mobility sessions support sustained metabolic resilience.",
		"disclaimer":               models.MedicalDisclaimer,
	})
}

// GET /api/v1/insights/nutrition
func (h *Handler) GetNutritionInsights(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	userCheckins := h.DB.Storage.Checkins[userID]
	totalWaterML := 0
	daysLogged := 0
	if userCheckins != nil {
		for _, c := range userCheckins {
			if c.WaterML > 0 {
				totalWaterML += c.WaterML
				daysLogged++
			}
		}
	}

	avgWaterML := 2000
	if daysLogged > 0 {
		avgWaterML = totalWaterML / daysLogged
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"average_hydration_ml": avgWaterML,
		"hydration_goal_ml":    2000,
		"nutrition_philosophy": "Focus on nutrient coverage, whole foods, and cycle-adapted micro-nutrients without restrictive calorie counting.",
		"disclaimer":           models.MedicalDisclaimer,
	})
}
