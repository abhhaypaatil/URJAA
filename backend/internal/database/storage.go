package database

import (
	"context"
	"sync"
	"time"
	"urjaa-backend/internal/models"
)

func contextWithTimeout(d time.Duration) (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), d)
}

type MemoryStorage struct {
	mu            sync.RWMutex
	Users         map[string]*models.User
	UsersByEmail  map[string]*models.User
	Profiles      map[string]*models.UserProfile
	Preferences   map[string]*models.UserPreferences
	CycleSettings map[string]*models.CycleSettings
	Cycles        map[string][]*models.CycleRecord
	Checkins      map[string]map[string]*models.DailyCheckin // userID -> (date -> checkin)
	Exercises     map[string]*ExerciseRecord
	Meals         map[string]*MealRecord
	Workouts      map[string]*WorkoutRecord
	Sessions      map[string][]*WorkoutSessionRecord
	MealLogs      map[string]map[string]bool // userID -> (date_mealID -> bool)
}

type ExerciseRecord struct {
	ID                     string   `json:"id"`
	Name                   string   `json:"name"`
	Category               string   `json:"category"`
	MuscleGroups           []string `json:"muscle_groups"`
	Difficulty             string   `json:"difficulty"`
	Equipment              string   `json:"equipment"`
	Type                   string   `json:"type"` // reps, time
	DefaultReps            int      `json:"default_reps"`
	DefaultDurationSeconds int      `json:"default_duration_seconds"`
	RestSeconds            int      `json:"rest_seconds"`
	Instructions           []string `json:"instructions"`
	CommonMistakes         []string `json:"common_mistakes"`
	QuietFriendly          bool     `json:"quiet_friendly"`
	LowImpact              bool     `json:"low_impact"`
	AnimationType          string   `json:"animation_type"`
	ProgressionExerciseID  *string  `json:"progression_exercise_id"`
	RegressionExerciseID   *string  `json:"regression_exercise_id"`
}

type MealRecord struct {
	ID                string           `json:"id"`
	Title             string           `json:"title"`
	MealType          string           `json:"meal_type"` // Breakfast, Lunch, Snack, Dinner
	PhaseTarget       string           `json:"phase_target"` // Menstrual, Follicular, Ovulatory, Luteal, Any
	DietaryPreference string           `json:"dietary_preference"` // Vegetarian, Eggetarian, Non-vegetarian, Vegan
	Description       string           `json:"description"`
	KeyNutrients      []string         `json:"key_nutrients"`
	PrepTimeMin       int              `json:"prep_time_min"`
	Items             []MealItemRecord `json:"items"`
}

type MealItemRecord struct {
	ID                  string               `json:"id"`
	MealID              string               `json:"meal_id"`
	FoodName            string               `json:"food_name"`
	Portion             string               `json:"portion"`
	Category            string               `json:"category"`
	SubstitutionOptions []SubstitutionOption `json:"substitution_options"`
}

type SubstitutionOption struct {
	Name   string `json:"name"`
	Reason string `json:"reason"`
}

type WorkoutRecord struct {
	ID                   string                   `json:"id"`
	Title                string                   `json:"title"`
	Description          string                   `json:"description"`
	Category             string                   `json:"category"`
	PhaseTarget          string                   `json:"phase_target"`
	Intensity            string                   `json:"intensity"`
	EstimatedDurationMin int                      `json:"estimated_duration_min"`
	IsQuiet              bool                     `json:"is_quiet"`
	IsLowImpact          bool                     `json:"is_low_impact"`
	Exercises            []WorkoutExerciseMapping `json:"exercises"`
}

type WorkoutExerciseMapping struct {
	ExerciseID    string          `json:"exercise_id"`
	Exercise      *ExerciseRecord `json:"exercise,omitempty"`
	OrderIndex    int             `json:"order_index"`
	Mode          string          `json:"mode"`
	Target        int             `json:"target"`
	TargetSeconds int             `json:"target_seconds"`
	RestSeconds   int             `json:"rest_seconds"`
}

type WorkoutSessionRecord struct {
	ID              string    `json:"id"`
	UserID          string    `json:"user_id"`
	WorkoutID       string    `json:"workout_id"`
	WorkoutTitle    string    `json:"workout_title"`
	Status          string    `json:"status"` // COMPLETED, SKIPPED, IN_PROGRESS
	DurationSeconds int       `json:"duration_seconds"`
	CompletionRate  float64   `json:"completion_rate"`
	PerceivedEffort string    `json:"perceived_effort"`
	ScheduledDate   string    `json:"scheduled_date"`
	StartedAt       time.Time `json:"started_at"`
	CompletedAt     *time.Time `json:"completed_at,omitempty"`
}

func NewMemoryStorage() *MemoryStorage {
	return &MemoryStorage{
		Users:         make(map[string]*models.User),
		UsersByEmail:  make(map[string]*models.User),
		Profiles:      make(map[string]*models.UserProfile),
		Preferences:   make(map[string]*models.UserPreferences),
		CycleSettings: make(map[string]*models.CycleSettings),
		Cycles:        make(map[string][]*models.CycleRecord),
		Checkins:      make(map[string]map[string]*models.DailyCheckin),
		Exercises:     make(map[string]*ExerciseRecord),
		Meals:         make(map[string]*MealRecord),
		Workouts:      make(map[string]*WorkoutRecord),
		Sessions:      make(map[string][]*WorkoutSessionRecord),
		MealLogs:      make(map[string]map[string]bool),
	}
}

func (s *MemoryStorage) SeedDefaultData() {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Seed 50+ Exercises
	s.seedExercises()
	// Seed Meals across 4 dietary preferences & 4 phases
	s.seedMeals()
	// Seed Workouts
	s.seedWorkouts()
}
