package calendar

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
	Service *Service
	DB      *database.DB
}

func NewHandler(svc *Service, db *database.DB) *Handler {
	return &Handler{
		Service: svc,
		DB:      db,
	}
}

// GET /api/v1/calendar?month=YYYY-MM&filter=all
func (h *Handler) GetMonth(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	monthStr := r.URL.Query().Get("month")
	if monthStr == "" {
		monthStr = time.Now().Format("2006-01")
	}

	filter := CalendarFilter(r.URL.Query().Get("filter"))
	if filter == "" {
		filter = FilterAll
	}

	summary, err := h.Service.BuildMonthView(userID, monthStr, filter)
	if err != nil {
		models.RespondError(w, http.StatusInternalServerError, "CALENDAR_ERROR", err.Error())
		return
	}

	models.RespondJSON(w, http.StatusOK, summary)
}

// GET /api/v1/calendar/:date
func (h *Handler) GetDate(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	dateStr := strings.TrimPrefix(r.URL.Path, "/api/v1/calendar/")
	targetTime, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		dateStr = time.Now().Format("2006-01-02")
		targetTime = time.Now()
	}

	monthStr := dateStr[:7]
	summary, err := h.Service.BuildMonthView(userID, monthStr, FilterAll)
	if err != nil {
		models.RespondError(w, http.StatusInternalServerError, "CALENDAR_ERROR", err.Error())
		return
	}

	var foundDay *CalendarDay
	for _, d := range summary.Days {
		if d.Date == dateStr {
			foundDay = d
			break
		}
	}

	var checkin *models.DailyCheckin
	if userCheckins := h.DB.Storage.Checkins[userID]; userCheckins != nil {
		checkin = userCheckins[dateStr]
	}

	workouts := make([]*database.WorkoutSessionRecord, 0)
	if userSessions := h.DB.Storage.Sessions[userID]; userSessions != nil {
		for _, s := range userSessions {
			if s.ScheduledDate == dateStr {
				workouts = append(workouts, s)
			}
		}
	}

	settings := h.DB.Storage.CycleSettings[userID]
	var phaseInfo *cycle.PhaseInfo
	if settings != nil {
		history := h.DB.Storage.Cycles[userID]
		phaseInfo, _ = h.Service.CycleService.CalculatePhase(settings, history, targetTime)
	}

	models.RespondJSON(w, http.StatusOK, DayDetailResponse{
		Day:        foundDay,
		Checkin:    checkin,
		Workouts:   workouts,
		PhaseInfo:  phaseInfo,
		Disclaimer: models.MedicalDisclaimer,
	})
}
