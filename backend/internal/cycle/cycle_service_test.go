package cycle

import (
	"testing"
	"time"

	"urjaa-backend/internal/models"
)

func TestCycleCalculation_28DayRegular(t *testing.T) {
	svc := NewService()
	baseDate := time.Date(2026, 8, 1, 0, 0, 0, 0, time.UTC)
	settings := &models.CycleSettings{
		UserID:          "test-user",
		LastPeriodStart: baseDate.Format("2006-01-02"),
		PeriodDuration:  5,
		AvgCycleLength:  28,
		IsRegular:       true,
	}

	// Day 3 -> Menstrual phase
	targetDay3 := baseDate.AddDate(0, 0, 2)
	pInfo3, err := svc.CalculatePhase(settings, nil, targetDay3)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if pInfo3.CurrentPhase != PhaseMenstrual {
		t.Errorf("expected Menstrual phase on day 3, got %s", pInfo3.CurrentPhase)
	}
	if pInfo3.CycleDay != 3 {
		t.Errorf("expected CycleDay 3, got %d", pInfo3.CycleDay)
	}
	if pInfo3.ConfidenceScore < 70 {
		t.Errorf("expected high confidence for regular cycle, got %d", pInfo3.ConfidenceScore)
	}

	// Day 8 -> Follicular phase
	targetDay8 := baseDate.AddDate(0, 0, 7)
	pInfo8, _ := svc.CalculatePhase(settings, nil, targetDay8)
	if pInfo8.CurrentPhase != PhaseFollicular {
		t.Errorf("expected Follicular phase on day 8, got %s", pInfo8.CurrentPhase)
	}

	// Day 14 -> Ovulatory phase
	targetDay14 := baseDate.AddDate(0, 0, 13)
	pInfo14, _ := svc.CalculatePhase(settings, nil, targetDay14)
	if pInfo14.CurrentPhase != PhaseOvulatory {
		t.Errorf("expected Ovulatory phase on day 14, got %s", pInfo14.CurrentPhase)
	}

	// Day 22 -> Luteal phase
	targetDay22 := baseDate.AddDate(0, 0, 21)
	pInfo22, _ := svc.CalculatePhase(settings, nil, targetDay22)
	if pInfo22.CurrentPhase != PhaseLuteal {
		t.Errorf("expected Luteal phase on day 22, got %s", pInfo22.CurrentPhase)
	}
}

func TestCycleCalculation_35DayCycle(t *testing.T) {
	svc := NewService()
	baseDate := time.Date(2026, 8, 1, 0, 0, 0, 0, time.UTC)
	settings := &models.CycleSettings{
		UserID:          "test-user-35",
		LastPeriodStart: baseDate.Format("2006-01-02"),
		PeriodDuration:  6,
		AvgCycleLength:  35,
		IsRegular:       true,
	}

	// Ovulation for 35 day cycle should be ~ Day 21 (35 - 14)
	targetOvulation := baseDate.AddDate(0, 0, 20)
	pInfo, err := svc.CalculatePhase(settings, nil, targetOvulation)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if pInfo.EstimatedOvulationDay != 21 {
		t.Errorf("expected ovulation on day 21, got %d", pInfo.EstimatedOvulationDay)
	}
	if pInfo.CurrentPhase != PhaseOvulatory {
		t.Errorf("expected Ovulatory on day 21, got %s", pInfo.CurrentPhase)
	}
}

func TestCycleCalculation_IrregularConfidence(t *testing.T) {
	svc := NewService()
	baseDate := time.Date(2026, 8, 1, 0, 0, 0, 0, time.UTC)
	settings := &models.CycleSettings{
		UserID:          "test-user-irregular",
		LastPeriodStart: baseDate.Format("2006-01-02"),
		PeriodDuration:  5,
		AvgCycleLength:  30,
		IsRegular:       false,
	}

	pInfo, err := svc.CalculatePhase(settings, nil, baseDate)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if pInfo.ConfidenceLevel != ConfidenceLow && pInfo.ConfidenceLevel != ConfidenceMedium {
		t.Errorf("expected lower confidence for irregular cycle, got %s", pInfo.ConfidenceLevel)
	}
	if pInfo.ConfidenceLabel == "" {
		t.Errorf("expected confidence label to be set")
	}
}
