package recommendation

import (
	"urjaa-backend/internal/cycle"
	"urjaa-backend/internal/database"
)

type EngineInput struct {
	Phase             cycle.PhaseType
	CycleDay          int
	Energy            string // High, Medium, Low
	Mood              string // Great, Good, Okay, Low, Bad
	Bloating          string // None, Mild, Moderate, High
	Cramps            string // None, Mild, Moderate, Severe
	Sleep             string // Good, Okay, Poor
	FitnessLevel      string // Beginner, Intermediate, Advanced
	Goal              string
	PreferredDuration int
	QuietMode         bool
	DietPreference    string // Vegetarian, Eggetarian, Non-vegetarian, Vegan
	PCOSMode          bool
}

type DailyRecommendation struct {
	Date                string                  `json:"date"`
	CyclePhase          cycle.PhaseType         `json:"cycle_phase"`
	CycleDay            int                     `json:"cycle_day"`
	Workout             *database.WorkoutRecord `json:"workout"`
	WorkoutFocus        string                  `json:"workout_focus"`
	IntensityLevel      string                  `json:"intensity_level"`
	NutritionFocus      string                  `json:"nutrition_focus"`
	RecommendedNutrients []string               `json:"recommended_nutrients"`
	HydrationTargetML   int                     `json:"hydration_target_ml"`
	HydrationTip        string                  `json:"hydration_tip"`
	RecoveryNote        string                  `json:"recovery_note"`
	IsPCOSAdapted       bool                    `json:"is_pcos_adapted"`
	Disclaimer          string                  `json:"disclaimer"`
}

// Configurable Rule Engine Thresholds per §16
type RuleConfig struct {
	MenstrualHydrationBase  int
	FollicularHydrationBase int
	OvulatoryHydrationBase  int
	LutealHydrationBase     int
}

func DefaultRuleConfig() *RuleConfig {
	return &RuleConfig{
		MenstrualHydrationBase:  2200,
		FollicularHydrationBase: 2000,
		OvulatoryHydrationBase:  2200,
		LutealHydrationBase:     2400,
	}
}
