package cycle

import (
	"encoding/json"
	"net/http"
	"time"

	"urjaa-backend/internal/database"
	"urjaa-backend/internal/middleware"
	"urjaa-backend/internal/models"
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

// GET /api/v1/cycle/current
func (h *Handler) GetCurrent(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	settings := h.DB.Storage.CycleSettings[userID]
	if settings == nil {
		models.RespondError(w, http.StatusNotFound, "NOT_FOUND", "Cycle settings not initialized")
		return
	}

	history := h.DB.Storage.Cycles[userID]
	phaseInfo, err := h.Service.CalculatePhase(settings, history, time.Now())
	if err != nil {
		models.RespondError(w, http.StatusInternalServerError, "CALCULATION_ERROR", err.Error())
		return
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"settings":   settings,
		"phase_info": phaseInfo,
	})
}

// GET /api/v1/cycle/phase
func (h *Handler) GetPhase(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	settings := h.DB.Storage.CycleSettings[userID]
	if settings == nil {
		models.RespondError(w, http.StatusNotFound, "NOT_FOUND", "Cycle settings not initialized")
		return
	}

	history := h.DB.Storage.Cycles[userID]
	targetDate := time.Now()
	if dateStr := r.URL.Query().Get("date"); dateStr != "" {
		if parsed, err := time.Parse("2006-01-02", dateStr); err == nil {
			targetDate = parsed
		}
	}

	phaseInfo, err := h.Service.CalculatePhase(settings, history, targetDate)
	if err != nil {
		models.RespondError(w, http.StatusInternalServerError, "CALCULATION_ERROR", err.Error())
		return
	}

	models.RespondJSON(w, http.StatusOK, phaseInfo)
}

// GET /api/v1/cycle/history
func (h *Handler) GetHistory(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	history := h.DB.Storage.Cycles[userID]
	if history == nil {
		history = []*models.CycleRecord{}
	}

	models.RespondJSON(w, http.StatusOK, history)
}

// POST /api/v1/cycle/period-start
func (h *Handler) PeriodStart(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	var req PeriodStartRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.StartDate == "" {
		req.StartDate = time.Now().Format("2006-01-02")
	}

	settings := h.DB.Storage.CycleSettings[userID]
	if settings != nil {
		// Calculate previous cycle length if valid
		if prevStart, err := time.Parse("2006-01-02", settings.LastPeriodStart); err == nil {
			if currStart, err := time.Parse("2006-01-02", req.StartDate); err == nil && currStart.After(prevStart) {
				lenDays := int(currStart.Sub(prevStart).Hours() / 24)
				if lenDays >= 15 && lenDays <= 60 {
					record := &models.CycleRecord{
						ID:             req.StartDate,
						UserID:         userID,
						StartDate:      settings.LastPeriodStart,
						EndDate:        &req.StartDate,
						CycleLength:    &lenDays,
						PeriodDuration: settings.PeriodDuration,
						Notes:          req.Notes,
						CreatedAt:      time.Now(),
					}
					h.DB.Storage.Cycles[userID] = append(h.DB.Storage.Cycles[userID], record)
				}
			}
		}

		settings.LastPeriodStart = req.StartDate
		settings.UpdatedAt = time.Now()
	}

	// Also mark bleeding in daily checkin for today
	checkins := h.DB.Storage.Checkins[userID]
	if checkins == nil {
		checkins = make(map[string]*models.DailyCheckin)
		h.DB.Storage.Checkins[userID] = checkins
	}
	existing := checkins[req.StartDate]
	if existing == nil {
		existing = &models.DailyCheckin{
			ID:             req.StartDate,
			UserID:         userID,
			Date:           req.StartDate,
			BleedingStatus: "period_started",
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		}
		checkins[req.StartDate] = existing
	} else {
		existing.BleedingStatus = "period_started"
		existing.UpdatedAt = time.Now()
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"message":  "Period start logged successfully",
		"settings": settings,
	})
}

// POST /api/v1/cycle/period-end
func (h *Handler) PeriodEnd(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	var req PeriodEndRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.EndDate == "" {
		req.EndDate = time.Now().Format("2006-01-02")
	}

	settings := h.DB.Storage.CycleSettings[userID]
	if settings != nil {
		if start, err := time.Parse("2006-01-02", settings.LastPeriodStart); err == nil {
			if end, err := time.Parse("2006-01-02", req.EndDate); err == nil && !end.Before(start) {
				dur := int(end.Sub(start).Hours()/24) + 1
				if dur >= 1 && dur <= 14 {
					settings.PeriodDuration = dur
					settings.UpdatedAt = time.Now()
				}
			}
		}
	}

	checkins := h.DB.Storage.Checkins[userID]
	if checkins != nil && checkins[req.EndDate] != nil {
		checkins[req.EndDate].BleedingStatus = "period_ended"
	}

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"message":  "Period end logged successfully",
		"settings": settings,
	})
}
