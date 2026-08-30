package calendar

import (
	"testing"
	"urjaa-backend/internal/cycle"
	"urjaa-backend/internal/database"
	"urjaa-backend/internal/models"
)

func TestCalendar_MonthAggregation(t *testing.T) {
	memDB := database.NewMemoryDB()
	cycleSvc := cycle.NewService()
	calSvc := NewService(memDB, cycleSvc)

	userID := "test-user-calendar"
	memDB.Storage.CycleSettings[userID] = &models.CycleSettings{
		UserID:          userID,
		LastPeriodStart: "2026-08-01",
		PeriodDuration:  5,
		AvgCycleLength:  28,
		IsRegular:       true,
	}

	summary, err := calSvc.BuildMonthView(userID, "2026-08", FilterAll)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if summary.DaysInMonth != 31 {
		t.Errorf("expected 31 days in August, got %d", summary.DaysInMonth)
	}
	if len(summary.Days) != 31 {
		t.Errorf("expected 31 day items, got %d", len(summary.Days))
	}
	// Day 1 should have IsPeriod = true
	if !summary.Days[0].IsPeriod {
		t.Errorf("expected Day 1 to be marked period")
	}
}
