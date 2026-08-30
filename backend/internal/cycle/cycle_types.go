package cycle

type PhaseType string

const (
	PhaseMenstrual  PhaseType = "Menstrual"
	PhaseFollicular PhaseType = "Follicular"
	PhaseOvulatory  PhaseType = "Ovulatory"
	PhaseLuteal     PhaseType = "Luteal"
)

type ConfidenceLevel string

const (
	ConfidenceHigh   ConfidenceLevel = "High"
	ConfidenceMedium ConfidenceLevel = "Medium"
	ConfidenceLow    ConfidenceLevel = "Low"
)

type PhaseInfo struct {
	CurrentPhase         PhaseType       `json:"current_phase"`
	CycleDay             int             `json:"cycle_day"`
	TotalCycleLength     int             `json:"total_cycle_length"`
	EstimatedOvulationDay int            `json:"estimated_ovulation_day"`
	EstimatedNextPeriod  string          `json:"estimated_next_period"` // YYYY-MM-DD
	DaysUntilNextPeriod  int             `json:"days_until_next_period"`
	ConfidenceScore      int             `json:"confidence_score"` // e.g. 82
	ConfidenceLevel      ConfidenceLevel `json:"confidence_level"` // High, Medium, Low
	ConfidenceLabel      string          `json:"confidence_label"` // "Estimated • 82% confidence"
	IsIrregular          bool            `json:"is_irregular"`
	PhaseDescription     string          `json:"phase_description"`
	EnergyTrend          string          `json:"energy_trend"`
	RecommendedFocus     string          `json:"recommended_focus"`
}

type PeriodStartRequest struct {
	StartDate string `json:"start_date"` // YYYY-MM-DD
	Notes     string `json:"notes,omitempty"`
}

type PeriodEndRequest struct {
	EndDate string `json:"end_date"` // YYYY-MM-DD
}

type UpdateCycleSettingsRequest struct {
	LastPeriodStart string `json:"last_period_start"`
	PeriodDuration  int    `json:"period_duration"`
	AvgCycleLength  int    `json:"avg_cycle_length"`
	IsRegular       bool   `json:"is_regular"`
}
