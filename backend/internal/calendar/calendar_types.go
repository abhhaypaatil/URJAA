package calendar

import (
	"urjaa-backend/internal/cycle"
	"urjaa-backend/internal/database"
	"urjaa-backend/internal/models"
)

type CalendarFilter string

const (
	FilterAll         CalendarFilter = "all"
	FilterCycle       CalendarFilter = "cycle"
	FilterExercise    CalendarFilter = "exercise"
	FilterNutrition   CalendarFilter = "nutrition"
	FilterHydration   CalendarFilter = "hydration"
	FilterMood        CalendarFilter = "mood"
	FilterEnergy      CalendarFilter = "energy"
	FilterSleep       CalendarFilter = "sleep"
	FilterConsistency CalendarFilter = "consistency"
)

type CalendarDay struct {
	Date              string          `json:"date"` // YYYY-MM-DD
	DayOfMonth        int             `json:"day_of_month"`
	DayOfWeek         string          `json:"day_of_week"`
	IsFuture          bool            `json:"is_future"`
	IsToday           bool            `json:"is_today"`
	
	// Cycle
	CycleDay          int             `json:"cycle_day"`
	EstimatedPhase    cycle.PhaseType `json:"estimated_phase"`
	IsPeriod          bool            `json:"is_period"`
	IsEstimatedPeriod bool            `json:"is_estimated_period"`
	IsOvulationWindow bool            `json:"is_ovulation_window"`

	// Exercise (§10 mode-specific: COMPLETED vs SKIPPED vs NONE)
	WorkoutStatus     string          `json:"workout_status"` // COMPLETED, SKIPPED, NONE
	WorkoutTitle      string          `json:"workout_title,omitempty"`
	WorkoutMinutes    int             `json:"workout_minutes,omitempty"`

	// Nutrition (§10: Followed / Partial / Not followed / Not logged)
	NutritionStatus   string          `json:"nutrition_status"` // Followed, Partial, Not followed, Not logged
	MealsCompleted    int             `json:"meals_completed"`

	// Hydration
	WaterML           int             `json:"water_ml"`
	WaterTargetML     int             `json:"water_target_ml"`
	WaterPercentage   int             `json:"water_percentage"`

	// Wellness Logs
	Mood              string          `json:"mood,omitempty"`
	Energy            string          `json:"energy,omitempty"`
	Sleep             string          `json:"sleep,omitempty"`
	Bloating          string          `json:"bloating,omitempty"`
	Cramps            string          `json:"cramps,omitempty"`
	CheckinCompleted  bool            `json:"checkin_completed"`

	// Consistency Score (0 - 100)
	ConsistencyScore  int             `json:"consistency_score"`
}

type MonthSummary struct {
	Month             string         `json:"month"` // YYYY-MM
	DaysInMonth       int            `json:"days_in_month"`
	Days              []*CalendarDay `json:"days"`
	ActiveFilter      CalendarFilter `json:"active_filter"`
	
	// Streaks & Stats
	CheckinStreakDays int            `json:"checkin_streak_days"`
	WorkoutStreakDays int            `json:"workout_streak_days"`
	HydrationStreak   int            `json:"hydration_streak"`
	OverallConsistencyScore int      `json:"overall_consistency_score"`
	SupportiveStreakMessage string   `json:"supportive_streak_message"`
}

type DayDetailResponse struct {
	Day        *CalendarDay                 `json:"day"`
	Checkin    *models.DailyCheckin         `json:"checkin,omitempty"`
	Workouts   []*database.WorkoutSessionRecord `json:"workouts,omitempty"`
	Meals      []map[string]interface{}     `json:"meals,omitempty"`
	PhaseInfo  *cycle.PhaseInfo             `json:"phase_info,omitempty"`
	Disclaimer string                       `json:"disclaimer"`
}
