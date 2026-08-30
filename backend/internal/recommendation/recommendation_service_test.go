package recommendation

import (
	"testing"
	"urjaa-backend/internal/cycle"
	"urjaa-backend/internal/database"
	"urjaa-backend/internal/models"
)

func TestRecommendation_MenstrualWithCramps(t *testing.T) {
	memDB := database.NewMemoryDB()
	svc := NewService(memDB)

	input := EngineInput{
		Phase:             cycle.PhaseMenstrual,
		CycleDay:          2,
		Energy:            "Low",
		Cramps:            "Moderate",
		FitnessLevel:      "Beginner",
		Goal:              "Better overall health",
		PreferredDuration: 15,
		QuietMode:         false,
		DietPreference:    "Vegetarian",
		PCOSMode:          false,
	}

	rec := svc.GenerateRecommendation(input)
	if rec == nil {
		t.Fatalf("expected recommendation, got nil")
	}
	if rec.CyclePhase != cycle.PhaseMenstrual {
		t.Errorf("expected menstrual phase, got %s", rec.CyclePhase)
	}
	if rec.IntensityLevel != "Gentle Recovery" {
		t.Errorf("expected Gentle Recovery for menstrual with cramps, got %s", rec.IntensityLevel)
	}
	if rec.Disclaimer != models.MedicalDisclaimer {
		t.Errorf("disclaimer mismatch: got %s", rec.Disclaimer)
	}
}

func TestRecommendation_PCOSMode(t *testing.T) {
	memDB := database.NewMemoryDB()
	svc := NewService(memDB)

	input := EngineInput{
		Phase:             cycle.PhaseFollicular,
		CycleDay:          8,
		Energy:            "High",
		FitnessLevel:      "Beginner",
		Goal:              "Weight management",
		PreferredDuration: 15,
		PCOSMode:          true,
	}

	rec := svc.GenerateRecommendation(input)
	if !rec.IsPCOSAdapted {
		t.Errorf("expected PCOS adaptation flag true")
	}
	if rec.Disclaimer != models.MedicalDisclaimer {
		t.Errorf("disclaimer missing in PCOS mode")
	}
}
