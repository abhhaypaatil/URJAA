package recommendation

import (
	"fmt"
	"strings"
	"time"

	"urjaa-backend/internal/cycle"
	"urjaa-backend/internal/database"
	"urjaa-backend/internal/models"
)

type Service struct {
	Config *RuleConfig
	DB     *database.DB
}

func NewService(db *database.DB) *Service {
	return &Service{
		Config: DefaultRuleConfig(),
		DB:     db,
	}
}

// GenerateRecommendation computes today's cycle-aware wellness recommendations deterministically.
func (s *Service) GenerateRecommendation(input EngineInput) *DailyRecommendation {
	today := time.Now().Format("2006-01-02")
	rec := &DailyRecommendation{
		Date:          today,
		CyclePhase:    input.Phase,
		CycleDay:      input.CycleDay,
		IsPCOSAdapted: input.PCOSMode,
		Disclaimer:    models.MedicalDisclaimer,
	}

	// 1. Determine Nutrition & Hydration Focus based on Cycle Phase and Symptoms
	switch input.Phase {
	case cycle.PhaseMenstrual:
		rec.NutritionFocus = "Focus on iron-replenishing foods, bioavailable protein, and comforting warm dishes to ease cramps."
		rec.RecommendedNutrients = []string{"Iron", "Folate", "Magnesium", "Vitamin C", "Healthy Fats"}
		rec.HydrationTargetML = s.Config.MenstrualHydrationBase
		rec.HydrationTip = "Sip warm herbal teas (ginger, chamomile) or lemon water throughout the morning to alleviate pelvic tension."
		rec.RecoveryNote = "Honor your natural baseline. Gentle resting, warm baths, and non-strenuous pelvic stretches support your flow."

	case cycle.PhaseFollicular:
		rec.NutritionFocus = "Nourish rising energy with lean proteins, complex whole grains, and fresh colorful vegetables."
		rec.RecommendedNutrients = []string{"Lean Protein", "Complex Carbs", "Zinc", "Fiber", "B-Vitamins"}
		rec.HydrationTargetML = s.Config.FollicularHydrationBase
		rec.HydrationTip = "Stay consistently hydrated to support metabolic efficiency and vibrant daytime energy."
		rec.RecoveryNote = "Your body handles training volume well right now. Enjoy dynamic full-body movement."

	case cycle.PhaseOvulatory:
		rec.NutritionFocus = "Prioritize antioxidant-rich fruits, healthy omega fats, and fiber to support cellular vitality."
		rec.RecommendedNutrients = []string{"Omega-3", "Antioxidants", "Fiber", "Calcium", "Protein"}
		rec.HydrationTargetML = s.Config.OvulatoryHydrationBase
		rec.HydrationTip = "Keep cold or infused water handy, especially before and after peak workouts."
		rec.RecoveryNote = "High stamina window. Focus on strong posture, full range of motion, and mindful recovery."

	case cycle.PhaseLuteal:
		rec.NutritionFocus = "Emphasize magnesium, potassium, and complex carbs to stabilize mood, minimize cravings, and curb bloating."
		rec.RecommendedNutrients = []string{"Magnesium", "Potassium", "Vitamin B6", "Anti-inflammatory Fats", "Fiber"}
		rec.HydrationTargetML = s.Config.LutealHydrationBase
		rec.HydrationTip = "Increase water intake slightly to help your kidneys naturally flush excess fluid retention."
		rec.RecoveryNote = "Progesterone may increase resting body temperature. Prioritize quality sleep and low-impact steady movements."
	}

	// 2. Adjust for PCOS Mode if enabled
	if input.PCOSMode {
		rec.NutritionFocus += " (PCOS Mode: Focused on low glycemic-impact meals, fiber-first digestion, and consistent protein intake)."
		rec.RecoveryNote += " Gentle daily movement helps support balanced metabolic health."
	}

	// 3. Adjust for extreme symptoms (Severe Cramps, Poor Sleep, Low Energy)
	hasSevereCramps := strings.EqualFold(input.Cramps, "Severe") || strings.EqualFold(input.Cramps, "Moderate")
	hasLowEnergy := strings.EqualFold(input.Energy, "Low") || strings.EqualFold(input.Mood, "Bad")

	if hasSevereCramps || (input.Phase == cycle.PhaseMenstrual && hasLowEnergy) {
		rec.IntensityLevel = "Gentle Recovery"
		rec.WorkoutFocus = "Restorative Pelvic Ease & Gentle Mobility"
		rec.Workout = s.findBestWorkout("Recovery", input.PreferredDuration, input.QuietMode)
	} else if input.Phase == cycle.PhaseFollicular || input.Phase == cycle.PhaseOvulatory {
		if hasLowEnergy {
			rec.IntensityLevel = "Moderate"
			rec.WorkoutFocus = "Steady Full-Body Movement"
			rec.Workout = s.findBestWorkout("Full body", input.PreferredDuration, input.QuietMode)
		} else {
			rec.IntensityLevel = "Dynamic"
			rec.WorkoutFocus = "Full-Body Strength & Stamina"
			rec.Workout = s.findBestWorkout("Full body", input.PreferredDuration, input.QuietMode)
		}
	} else { // Luteal
		rec.IntensityLevel = "Low-Impact"
		rec.WorkoutFocus = "Glute & Core Stability"
		rec.Workout = s.findBestWorkout("Lower body", input.PreferredDuration, input.QuietMode)
	}

	// If no workout found, fallback to gentle mobility
	if rec.Workout == nil {
		for _, w := range s.DB.Storage.Workouts {
			rec.Workout = w
			break
		}
	}

	// Build transparent, accessible personalization rationale per §4.2
	durationStr := fmt.Sprintf("%d minutes", input.PreferredDuration)
	if input.PreferredDuration <= 0 {
		durationStr = "15 minutes"
	}
	fitnessStr := input.FitnessLevel
	if fitnessStr == "" {
		fitnessStr = "Beginner"
	}

	if hasSevereCramps || (input.Phase == cycle.PhaseMenstrual && hasLowEnergy) {
		reasonSymptom := input.Cramps
		if reasonSymptom == "" {
			reasonSymptom = "lower energy"
		}
		rec.PersonalizationReason = fmt.Sprintf("Suggested because you reported %s in your %s phase. Prioritizing gentle restorative movement to honor your recovery.", reasonSymptom, input.Phase)
	} else if strings.Contains(strings.ToLower(input.Goal), "strength") {
		rec.PersonalizationReason = fmt.Sprintf("Suggested because your goal is to build strength, tailored for %s-friendly progression with %s duration.", fitnessStr, durationStr)
	} else if strings.Contains(strings.ToLower(input.Goal), "flexibility") || strings.Contains(strings.ToLower(input.Goal), "mobility") {
		rec.PersonalizationReason = fmt.Sprintf("Suggested because you prefer mobility and flexibility, matching your %s available time.", durationStr)
	} else {
		rec.PersonalizationReason = fmt.Sprintf("Suggested because you prefer %s-friendly workouts and have %s available in your %s phase.", fitnessStr, durationStr, input.Phase)
	}

	if input.QuietMode {
		rec.PersonalizationReason += " Configured with zero-jumping quiet mode for peaceful home practice."
	}

	return rec
}

func (s *Service) findBestWorkout(targetCategory string, preferredDuration int, quietOnly bool) *database.WorkoutRecord {
	var bestMatch *database.WorkoutRecord

	for _, w := range s.DB.Storage.Workouts {
		if quietOnly && !w.IsQuiet {
			continue
		}
		if strings.EqualFold(w.Category, targetCategory) {
			if bestMatch == nil || (w.EstimatedDurationMin <= preferredDuration && w.EstimatedDurationMin > bestMatch.EstimatedDurationMin) {
				bestMatch = w
			}
		}
	}

	if bestMatch != nil {
		return bestMatch
	}

	// Fallback to any matching category or quiet workout
	for _, w := range s.DB.Storage.Workouts {
		if !quietOnly || w.IsQuiet {
			return w
		}
	}

	return nil
}
