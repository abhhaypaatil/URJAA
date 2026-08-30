package cycle

import (
	"fmt"
	"math"
	"time"
	"urjaa-backend/internal/models"
)

type Service struct {
	// Storage and helper functions
}

func NewService() *Service {
	return &Service{}
}

// CalculatePhase computes the 4-phase boundaries, ovulation, confidence score, and returns phase info.
// Never assumes 28 days; uses avgCycleLength, periodDuration, lastPeriodStart, and historical cycles.
func (s *Service) CalculatePhase(settings *models.CycleSettings, historicalCycles []*models.CycleRecord, targetDate time.Time) (*PhaseInfo, error) {
	if settings == nil {
		return nil, fmt.Errorf("cycle settings not configured")
	}

	startDate, err := time.Parse("2006-01-02", settings.LastPeriodStart)
	if err != nil {
		startDate = targetDate
	}

	cycleLength := settings.AvgCycleLength
	if cycleLength < 21 {
		cycleLength = 28
	} else if cycleLength > 45 {
		cycleLength = 35
	}

	periodDuration := settings.PeriodDuration
	if periodDuration < 2 {
		periodDuration = 5
	} else if periodDuration > 10 {
		periodDuration = 7
	}

	// Calculate days passed since last period start
	daysPassed := int(targetDate.Sub(startDate).Hours()/24) + 1
	if daysPassed < 1 {
		daysPassed = 1
	}

	// Current cycle day (1-indexed, wrapping around if past cycleLength)
	currentCycleDay := ((daysPassed - 1) % cycleLength) + 1
	cycleCountCompleted := (daysPassed - 1) / cycleLength

	// Ovulation day estimation (approx cycleLength - 14)
	ovulationDay := cycleLength - 14
	if ovulationDay < periodDuration+2 {
		ovulationDay = periodDuration + 2
	}

	// Phase determination
	var phase PhaseType
	var phaseDesc, energyTrend, focus string

	if currentCycleDay <= periodDuration {
		phase = PhaseMenstrual
		phaseDesc = "Menstrual Phase — Your body is shedding the uterine lining. Rest, warmth, gentle recovery, and iron-dense nourishment support your vitality."
		energyTrend = "Lower baseline energy. Natural time for restorative pacing."
		focus = "Restorative movement, iron-rich meals, gentle hydration."
	} else if currentCycleDay < ovulationDay-1 {
		phase = PhaseFollicular
		phaseDesc = "Follicular Phase — Estrogen begins to rise as follicles develop. You may experience increasing physical energy, creativity, and stamina."
		energyTrend = "Rising energy and endurance."
		focus = "Dynamic movement, lean proteins, nutrient-dense fresh meals."
	} else if currentCycleDay <= ovulationDay+2 {
		phase = PhaseOvulatory
		phaseDesc = "Ovulatory Phase — Peak estrogen and LH surge mark your estimated fertility window. Energy, confidence, and metabolic output often peak."
		energyTrend = "Peak energy and strength."
		focus = "Peak strength or full-body workouts, antioxidant-rich foods."
	} else {
		phase = PhaseLuteal
		phaseDesc = "Luteal Phase — Progesterone dominates to prepare the body. As progesterone drops later in the phase, prioritizing steady meals and low-impact movement aids comfort."
		energyTrend = "Gradually tapering energy. Prioritize steady pacing."
		focus = "Low-impact strength, magnesium-rich foods, complex carbohydrates."
	}

	// Estimated Next Period Date
	nextPeriodDate := startDate.AddDate(0, 0, (cycleCountCompleted+1)*cycleLength)
	daysUntilNextPeriod := int(nextPeriodDate.Sub(targetDate).Hours() / 24)
	if daysUntilNextPeriod < 0 {
		daysUntilNextPeriod = 0
	}

	// Confidence Calculation
	confidenceScore, confidenceLevel := s.calculateConfidence(settings, historicalCycles, daysPassed, cycleLength)

	var confidenceLabel string
	if settings.IsRegular {
		confidenceLabel = fmt.Sprintf("Estimated • %d%% confidence", confidenceScore)
	} else {
		confidenceLabel = fmt.Sprintf("Estimated • Low confidence (%d%%)", confidenceScore)
	}

	return &PhaseInfo{
		CurrentPhase:          phase,
		CycleDay:              currentCycleDay,
		TotalCycleLength:      cycleLength,
		EstimatedOvulationDay: ovulationDay,
		EstimatedNextPeriod:   nextPeriodDate.Format("2006-01-02"),
		DaysUntilNextPeriod:   daysUntilNextPeriod,
		ConfidenceScore:       confidenceScore,
		ConfidenceLevel:       confidenceLevel,
		ConfidenceLabel:       confidenceLabel,
		IsIrregular:           !settings.IsRegular,
		PhaseDescription:      phaseDesc,
		EnergyTrend:           energyTrend,
		RecommendedFocus:      focus,
	}, nil
}

func (s *Service) calculateConfidence(settings *models.CycleSettings, history []*models.CycleRecord, daysPassed, cycleLength int) (int, ConfidenceLevel) {
	baseScore := 80
	if !settings.IsRegular {
		baseScore = 50
	}

	// Historical cycle count bonus (up to +10%)
	historyCount := len(history)
	if historyCount > 0 {
		baseScore += int(math.Min(float64(historyCount*2), 10))
	}

	// Historical variability check
	if historyCount >= 2 {
		varianceSum := 0.0
		for _, c := range history {
			if c.CycleLength != nil {
				diff := float64(*c.CycleLength - cycleLength)
				varianceSum += diff * diff
			}
		}
		stdDev := math.Sqrt(varianceSum / float64(historyCount))
		if stdDev > 4 {
			baseScore -= int(stdDev)
		} else if stdDev <= 1.5 {
			baseScore += 5
		}
	}

	// Penalty if days passed has exceeded average cycle length without an updated period log
	if daysPassed > cycleLength {
		overflowDays := daysPassed - cycleLength
		baseScore -= overflowDays * 4
	}

	if baseScore > 95 {
		baseScore = 95
	}
	if baseScore < 30 {
		baseScore = 30
	}

	var level ConfidenceLevel
	if baseScore >= 75 {
		level = ConfidenceHigh
	} else if baseScore >= 55 {
		level = ConfidenceMedium
	} else {
		level = ConfidenceLow
	}

	return baseScore, level
}
