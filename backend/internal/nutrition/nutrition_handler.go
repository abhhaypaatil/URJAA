package nutrition

import (
	"net/http"
	"strings"
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

// GET /api/v1/nutrition/today
func (h *Handler) GetToday(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	profile := h.DB.Storage.Profiles[userID]
	dietPref := "Vegetarian"
	if profile != nil && profile.DietaryPreference != "" {
		dietPref = profile.DietaryPreference
	}

	settings := h.DB.Storage.CycleSettings[userID]
	currentPhase := cycle.PhaseMenstrual
	if settings != nil {
		history := h.DB.Storage.Cycles[userID]
		if pInfo, err := h.CycleService.CalculatePhase(settings, history, time.Now()); err == nil {
			currentPhase = pInfo.CurrentPhase
		}
	}

	today := time.Now().Format("2006-01-02")
	userLogs := h.DB.Storage.MealLogs[userID]

	// Find meals matching phase and diet
	recommendedMeals := make([]map[string]interface{}, 0)
	for _, m := range h.DB.Storage.Meals {
		if (strings.EqualFold(m.PhaseTarget, string(currentPhase)) || strings.EqualFold(m.PhaseTarget, "Any")) &&
			strings.EqualFold(m.DietaryPreference, dietPref) {
			
			logKey := today + "_" + m.ID
			isCompleted := false
			if userLogs != nil && userLogs[logKey] {
				isCompleted = true
			}

			recommendedMeals = append(recommendedMeals, map[string]interface{}{
				"meal":        m,
				"completed":   isCompleted,
				"phase_focus": currentPhase,
			})
		}
	}

	// Fallback to all meals matching diet if phase has none
	if len(recommendedMeals) == 0 {
		for _, m := range h.DB.Storage.Meals {
			if strings.EqualFold(m.DietaryPreference, dietPref) {
				logKey := today + "_" + m.ID
				isCompleted := false
				if userLogs != nil && userLogs[logKey] {
					isCompleted = true
				}
				recommendedMeals = append(recommendedMeals, map[string]interface{}{
					"meal":        m,
					"completed":   isCompleted,
					"phase_focus": currentPhase,
				})
			}
		}
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"date":               today,
		"phase":              currentPhase,
		"dietary_preference": dietPref,
		"meals":              recommendedMeals,
		"disclaimer":         models.MedicalDisclaimer,
	})
}

// POST /api/v1/nutrition/meals/:id/complete
func (h *Handler) ToggleMealComplete(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	mealID := strings.TrimPrefix(r.URL.Path, "/api/v1/nutrition/meals/")
	mealID = strings.TrimSuffix(mealID, "/complete")

	today := time.Now().Format("2006-01-02")
	if h.DB.Storage.MealLogs[userID] == nil {
		h.DB.Storage.MealLogs[userID] = make(map[string]bool)
	}

	logKey := today + "_" + mealID
	h.DB.Storage.MealLogs[userID][logKey] = !h.DB.Storage.MealLogs[userID][logKey]
	completed := h.DB.Storage.MealLogs[userID][logKey]

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"meal_id":   mealID,
		"completed": completed,
		"date":      today,
	})
}

// GET /api/v1/nutrition/substitutions/:mealItemId
func (h *Handler) GetSubstitutions(w http.ResponseWriter, r *http.Request) {
	itemID := strings.TrimPrefix(r.URL.Path, "/api/v1/nutrition/substitutions/")

	for _, m := range h.DB.Storage.Meals {
		for _, item := range m.Items {
			if item.ID == itemID {
				models.RespondJSON(w, http.StatusOK, map[string]interface{}{
					"food_name":             item.FoodName,
					"portion":               item.Portion,
					"category":              item.Category,
					"substitution_options": item.SubstitutionOptions,
				})
				return
			}
		}
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"substitution_options": []database.SubstitutionOption{
			{Name: "Almond Milk Porridge", Reason: "Dairy-free gentle alternative"},
			{Name: "Steamed Edamame", Reason: "Plant-protein alternative"},
		},
	})
}

// GET /api/v1/nutrition/progress
func (h *Handler) GetProgress(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	today := time.Now().Format("2006-01-02")
	userLogs := h.DB.Storage.MealLogs[userID]
	completedCount := 0
	if userLogs != nil {
		for key, val := range userLogs {
			if strings.HasPrefix(key, today) && val {
				completedCount++
			}
		}
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"date":            today,
		"completed_meals": completedCount,
		"total_meals":     4,
		"adherence_rate":  float64(completedCount) / 4.0,
	})
}
