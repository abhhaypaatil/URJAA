-- Urjaa Database Schema Migration 001_init.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    wellness_goal VARCHAR(50) NOT NULL DEFAULT 'Better overall health',
    fitness_level VARCHAR(30) NOT NULL DEFAULT 'Beginner',
    preferred_workout_duration INT NOT NULL DEFAULT 15,
    dietary_preference VARCHAR(30) NOT NULL DEFAULT 'Vegetarian',
    exercise_limitations TEXT[] NOT NULL DEFAULT '{}',
    pcos_pcod_mode BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme_preference VARCHAR(20) NOT NULL DEFAULT 'system',
    quiet_mode BOOLEAN NOT NULL DEFAULT FALSE,
    notify_period BOOLEAN NOT NULL DEFAULT TRUE,
    notify_checkin BOOLEAN NOT NULL DEFAULT TRUE,
    notify_hydration BOOLEAN NOT NULL DEFAULT TRUE,
    notify_workout BOOLEAN NOT NULL DEFAULT TRUE,
    notify_nutrition BOOLEAN NOT NULL DEFAULT TRUE,
    notify_insights BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cycle Settings
CREATE TABLE IF NOT EXISTS cycle_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    last_period_start DATE NOT NULL,
    period_duration INT NOT NULL DEFAULT 5,
    avg_cycle_length INT NOT NULL DEFAULT 28,
    is_regular BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Historical / Logged Cycles
CREATE TABLE IF NOT EXISTS cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    cycle_length INT,
    period_duration INT NOT NULL DEFAULT 5,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cycles_user_start ON cycles(user_id, start_date DESC);

-- Daily Check-ins
CREATE TABLE IF NOT EXISTS daily_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    bleeding_status VARCHAR(30) NOT NULL DEFAULT 'no_bleeding', -- period_started, period_continuing, period_ended, no_bleeding
    mood VARCHAR(20), -- Great, Good, Okay, Low, Bad
    energy VARCHAR(20), -- High, Medium, Low
    bloating VARCHAR(20), -- None, Mild, Moderate, High
    cramps VARCHAR(20), -- None, Mild, Moderate, Severe
    sleep VARCHAR(20), -- Good, Okay, Poor
    water_ml INT NOT NULL DEFAULT 0,
    nutrition_adherence VARCHAR(30), -- Followed, Partially followed, Did not follow
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, date)
);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_date ON daily_checkins(user_id, date DESC);

-- Symptoms Catalog
CREATE TABLE IF NOT EXISTS symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS daily_checkin_symptoms (
    checkin_id UUID NOT NULL REFERENCES daily_checkins(id) ON DELETE CASCADE,
    symptom_id UUID NOT NULL REFERENCES symptoms(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL DEFAULT 'Mild',
    PRIMARY KEY(checkin_id, symptom_id)
);

-- Foods
CREATE TABLE IF NOT EXISTS foods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    calories_approx INT,
    protein_g REAL NOT NULL DEFAULT 0,
    carbs_g REAL NOT NULL DEFAULT 0,
    fats_g REAL NOT NULL DEFAULT 0,
    fiber_g REAL NOT NULL DEFAULT 0,
    iron_mg REAL NOT NULL DEFAULT 0,
    calcium_mg REAL NOT NULL DEFAULT 0,
    folate_mcg REAL NOT NULL DEFAULT 0,
    vitamin_c_mg REAL NOT NULL DEFAULT 0,
    dietary_flags TEXT[] NOT NULL DEFAULT '{}', -- vegetarian, vegan, eggetarian, non-vegetarian
    highlights TEXT[] NOT NULL DEFAULT '{}'
);

-- Meals
CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    meal_type VARCHAR(30) NOT NULL, -- Breakfast, Lunch, Snack, Dinner
    phase_target VARCHAR(30) NOT NULL, -- Menstrual, Follicular, Ovulatory, Luteal, Any
    dietary_preference VARCHAR(30) NOT NULL, -- Vegetarian, Eggetarian, Non-vegetarian, Vegan
    description TEXT NOT NULL,
    key_nutrients TEXT[] NOT NULL DEFAULT '{}',
    prep_time_min INT NOT NULL DEFAULT 15,
    is_default BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_meals_phase_diet ON meals(phase_target, dietary_preference, meal_type);

-- Meal Items & Substitutions
CREATE TABLE IF NOT EXISTS meal_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
    food_name VARCHAR(100) NOT NULL,
    portion VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    substitution_options JSONB NOT NULL DEFAULT '[]'
);

-- User Meal Completion / Substitution Logs
CREATE TABLE IF NOT EXISTS user_meal_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    replaced_with_title VARCHAR(150),
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, date, meal_id)
);
CREATE INDEX IF NOT EXISTS idx_meal_logs_user_date ON user_meal_logs(user_id, date);

-- Exercises Catalog
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL, -- Full body, Upper body, Lower body, Core, Mobility, Recovery
    muscle_groups TEXT[] NOT NULL DEFAULT '{}', -- Shoulders, Chest, Back, Biceps, Triceps, Core, Abs, Obliques, Lower back, Glutes, Quads, Hamstrings, Calves, Hip mobility
    difficulty VARCHAR(30) NOT NULL DEFAULT 'Beginner', -- Beginner, Intermediate, Advanced
    equipment VARCHAR(50) NOT NULL DEFAULT 'None (Bodyweight)',
    type VARCHAR(20) NOT NULL DEFAULT 'reps', -- reps, time
    default_reps INT NOT NULL DEFAULT 10,
    default_duration_seconds INT NOT NULL DEFAULT 30,
    rest_seconds INT NOT NULL DEFAULT 20,
    instructions TEXT[] NOT NULL DEFAULT '{}',
    common_mistakes TEXT[] NOT NULL DEFAULT '{}',
    quiet_friendly BOOLEAN NOT NULL DEFAULT TRUE,
    low_impact BOOLEAN NOT NULL DEFAULT TRUE,
    animation_type VARCHAR(50) NOT NULL DEFAULT 'squat_pattern', -- squat_pattern, push_pattern, static_hold, jumping_pattern, lunge_pattern, plank_pattern, stretch_pattern
    progression_exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
    regression_exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category, difficulty);

-- Workout Templates
CREATE TABLE IF NOT EXISTS workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    phase_target VARCHAR(30) NOT NULL, -- Menstrual, Follicular, Ovulatory, Luteal, Any
    intensity VARCHAR(30) NOT NULL DEFAULT 'Moderate', -- Low, Moderate, High
    estimated_duration_min INT NOT NULL DEFAULT 15,
    is_quiet BOOLEAN NOT NULL DEFAULT TRUE,
    is_low_impact BOOLEAN NOT NULL DEFAULT TRUE
);

-- Workout Exercise Items
CREATE TABLE IF NOT EXISTS workout_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    order_index INT NOT NULL,
    mode VARCHAR(20) NOT NULL DEFAULT 'reps', -- reps, time
    target INT NOT NULL DEFAULT 10,
    target_seconds INT NOT NULL DEFAULT 30,
    rest_seconds INT NOT NULL DEFAULT 20
);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_wid ON workout_exercises(workout_id, order_index);

-- Workout Sessions
CREATE TABLE IF NOT EXISTS workout_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED', -- COMPLETED, SKIPPED, IN_PROGRESS
    duration_seconds INT NOT NULL DEFAULT 0,
    completion_rate REAL NOT NULL DEFAULT 1.0,
    perceived_effort VARCHAR(30), -- Too easy, Good, Hard
    scheduled_date DATE NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date ON workout_sessions(user_id, scheduled_date);

-- Workout Session Exercise Logs
CREATE TABLE IF NOT EXISTS workout_session_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    order_index INT NOT NULL,
    completed_reps INT,
    completed_seconds INT,
    skipped BOOLEAN NOT NULL DEFAULT FALSE,
    replaced_with_id UUID REFERENCES exercises(id) ON DELETE SET NULL
);

-- Daily Recommendations Cache
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    cycle_phase VARCHAR(30) NOT NULL,
    workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
    workout_title VARCHAR(150),
    workout_category VARCHAR(50),
    intensity VARCHAR(30),
    nutrition_focus TEXT NOT NULL,
    key_nutrients TEXT[] NOT NULL DEFAULT '{}',
    hydration_target_ml INT NOT NULL DEFAULT 2000,
    recovery_note TEXT NOT NULL,
    is_pcos_adapted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, date)
);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_date ON recommendations(user_id, date);
