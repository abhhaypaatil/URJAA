package checkin

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
	DB *database.DB
}

func NewHandler(db *database.DB) *Handler {
	return &Handler{DB: db}
}

type CheckinRequest struct {
	Date               string `json:"date"` // YYYY-MM-DD
	BleedingStatus     string `json:"bleeding_status"` // period_started, period_continuing, period_ended, no_bleeding
	Mood               string `json:"mood"` // Great, Good, Okay, Low, Bad
	Energy             string `json:"energy"` // High, Medium, Low
	Bloating           string `json:"bloating"` // None, Mild, Moderate, High
	Cramps             string `json:"cramps"` // None, Mild, Moderate, Severe
	Sleep              string `json:"sleep"` // Good, Okay, Poor
	WaterML            int    `json:"water_ml"`
	NutritionAdherence string `json:"nutrition_adherence"` // Followed, Partially followed, Did not follow
	Notes              string `json:"notes"`
}

// GET /api/v1/checkins/today
func (h *Handler) GetToday(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	today := time.Now().Format("2006-01-02")
	userCheckins := h.DB.Storage.Checkins[userID]
	if userCheckins == nil || userCheckins[today] == nil {
		models.RespondJSON(w, http.StatusOK, map[string]interface{}{
			"checked_in": false,
			"date":       today,
			"checkin":    nil,
		})
		return
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"checked_in": true,
		"date":       today,
		"checkin":    userCheckins[today],
	})
}

// POST /api/v1/checkins
func (h *Handler) SaveCheckin(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	var req CheckinRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		models.RespondError(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid request body")
		return
	}

	if req.Date == "" {
		req.Date = time.Now().Format("2006-01-02")
	}

	userCheckins := h.DB.Storage.Checkins[userID]
	if userCheckins == nil {
		userCheckins = make(map[string]*models.DailyCheckin)
		h.DB.Storage.Checkins[userID] = userCheckins
	}

	existing := userCheckins[req.Date]
	if existing == nil {
		existing = &models.DailyCheckin{
			ID:                 uuid.New().String(),
			UserID:             userID,
			Date:               req.Date,
			BleedingStatus:     req.BleedingStatus,
			Mood:               req.Mood,
			Energy:             req.Energy,
			Bloating:           req.Bloating,
			Cramps:             req.Cramps,
			Sleep:              req.Sleep,
			WaterML:            req.WaterML,
			NutritionAdherence: req.NutritionAdherence,
			Notes:              req.Notes,
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		}
		userCheckins[req.Date] = existing
	} else {
		if req.BleedingStatus != "" {
			existing.BleedingStatus = req.BleedingStatus
		}
		if req.Mood != "" {
			existing.Mood = req.Mood
		}
		if req.Energy != "" {
			existing.Energy = req.Energy
		}
		if req.Bloating != "" {
			existing.Bloating = req.Bloating
		}
		if req.Cramps != "" {
			existing.Cramps = req.Cramps
		}
		if req.Sleep != "" {
			existing.Sleep = req.Sleep
		}
		if req.WaterML > 0 {
			existing.WaterML = req.WaterML
		}
		if req.NutritionAdherence != "" {
			existing.NutritionAdherence = req.NutritionAdherence
		}
		existing.Notes = req.Notes
		existing.UpdatedAt = time.Now()
	}

	// Auto-update cycle settings if bleeding started was logged
	if strings.Contains(req.BleedingStatus, "started") {
		if settings := h.DB.Storage.CycleSettings[userID]; settings != nil {
			settings.LastPeriodStart = req.Date
			settings.UpdatedAt = time.Now()
		}
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"message": "Daily check-in saved successfully",
		"checkin": existing,
	})
}

// GET /api/v1/checkins/history
func (h *Handler) GetHistory(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	userCheckins := h.DB.Storage.Checkins[userID]
	list := make([]*models.DailyCheckin, 0)
	if userCheckins != nil {
		for _, c := range userCheckins {
			list = append(list, c)
		}
	}

	models.RespondJSON(w, http.StatusOK, list)
}
