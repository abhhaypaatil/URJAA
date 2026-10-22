package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"urjaa-backend/internal/auth"
	"urjaa-backend/internal/calendar"
	"urjaa-backend/internal/checkin"
	"urjaa-backend/internal/config"
	"urjaa-backend/internal/cycle"
	"urjaa-backend/internal/gamification"
	"urjaa-backend/internal/database"
	"urjaa-backend/internal/insights"
	"urjaa-backend/internal/middleware"
	"urjaa-backend/internal/models"
	"urjaa-backend/internal/nutrition"
	"urjaa-backend/internal/recommendation"
	"urjaa-backend/internal/users"
	"urjaa-backend/internal/workout"
)

func main() {
	cfg := config.LoadConfig()
	log.Printf("[URJAA] Starting Urjaa Backend API on port %s (%s environment)...", cfg.Port, cfg.AppEnv)

	// Database Connection & Seeds
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Fatal: Database initialization failed: %v", err)
	}

	if err := db.RunMigrations("./migrations"); err != nil {
		log.Printf("[DB] Migration notice: %v", err)
	}
	if err := db.RunSeeds("./seeds"); err != nil {
		log.Printf("[DB] Seeds notice: %v", err)
	}

	// Domain Services
	cycleSvc := cycle.NewService()
	recSvc := recommendation.NewService(db)
	calendarSvc := calendar.NewService(db, cycleSvc)
	authSvc := auth.NewService(cfg)

	// Handlers
	authHandler := auth.NewHandler(authSvc, db)
	usersHandler := users.NewHandler(db)
	cycleHandler := cycle.NewHandler(cycleSvc, db)
	checkinHandler := checkin.NewHandler(db)
	nutritionHandler := nutrition.NewHandler(db, cycleSvc)
	workoutHandler := workout.NewHandler(db, recSvc, cycleSvc)
	calendarHandler := calendar.NewHandler(calendarSvc, db)
	insightsHandler := insights.NewHandler(db, cycleSvc)
	gamificationHandler := gamification.NewHandler(db)

	// Router setup
	mux := http.NewServeMux()

	// Health Check routes
	mux.HandleFunc("/api/v1/health", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
			return
		}
		models.RespondJSON(w, http.StatusOK, map[string]interface{}{
			"status": "ok",
		})
	})
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		models.RespondJSON(w, http.StatusOK, map[string]interface{}{
			"status":     "ok",
			"app":        "Urjaa Backend",
			"timestamp":  time.Now(),
			"disclaimer": models.MedicalDisclaimer,
		})
	})

	// Public Auth Routes
	mux.HandleFunc("/api/v1/auth/register", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			authHandler.Register(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})
	mux.HandleFunc("/api/v1/auth/login", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			authHandler.Login(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})
	mux.HandleFunc("/api/v1/auth/refresh", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			authHandler.Refresh(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})
	mux.HandleFunc("/api/v1/auth/logout", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			authHandler.Logout(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})

	// Protected Routes Wrapper
	authMiddleware := middleware.Authenticate(cfg)

	// Protected Auth
	mux.Handle("/api/v1/auth/me", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			authHandler.Me(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))

	// User Profile & Onboarding
	mux.Handle("/api/v1/onboarding", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			usersHandler.CompleteOnboarding(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/profile", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			usersHandler.GetProfile(w, r)
		case http.MethodPut:
			usersHandler.UpdateProfile(w, r)
		case http.MethodDelete:
			usersHandler.DeleteAccount(w, r)
		default:
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/profile/export", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			usersHandler.ExportData(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/profile/clear-personalization", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			usersHandler.ClearPersonalization(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))

	// Settings
	mux.Handle("/api/v1/settings", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			usersHandler.GetSettings(w, r)
		case http.MethodPut:
			usersHandler.UpdateSettings(w, r)
		default:
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))

	// Cycle Endpoints
	mux.Handle("/api/v1/cycle/current", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			cycleHandler.GetCurrent(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/cycle/phase", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			cycleHandler.GetPhase(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/cycle/history", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			cycleHandler.GetHistory(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/cycle/period-start", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			cycleHandler.PeriodStart(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/cycle/period-end", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			cycleHandler.PeriodEnd(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))

	// Daily Check-ins
	mux.Handle("/api/v1/checkins/today", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			checkinHandler.GetToday(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/checkins", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost, http.MethodPut:
			checkinHandler.SaveCheckin(w, r)
		case http.MethodGet:
			checkinHandler.GetHistory(w, r)
		default:
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/checkins/history", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			checkinHandler.GetHistory(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))

	// Nutrition Endpoints
	mux.Handle("/api/v1/nutrition/today", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			nutritionHandler.GetToday(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/nutrition/progress", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			nutritionHandler.GetProgress(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/nutrition/meals/", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/complete") && r.Method == http.MethodPost {
			nutritionHandler.ToggleMealComplete(w, r)
		} else {
			models.RespondError(w, http.StatusNotFound, "NOT_FOUND", "Endpoint not found")
		}
	})))
	mux.Handle("/api/v1/nutrition/substitutions/", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			nutritionHandler.GetSubstitutions(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))

	// Workout Endpoints
	mux.Handle("/api/v1/workouts/recommended", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			workoutHandler.GetRecommended(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/workouts", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			workoutHandler.ListWorkouts(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/workouts/", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		if strings.HasPrefix(path, "/api/v1/workouts/exercises/") && strings.HasSuffix(path, "/replace") {
			workoutHandler.ReplaceExercise(w, r)
		} else if strings.HasPrefix(path, "/api/v1/workouts/sessions/") && strings.HasSuffix(path, "/complete") {
			workoutHandler.CompleteSession(w, r)
		} else if strings.HasSuffix(path, "/start") {
			workoutHandler.StartWorkout(w, r)
		} else if r.Method == http.MethodGet {
			workoutHandler.GetWorkout(w, r)
		} else {
			models.RespondError(w, http.StatusNotFound, "NOT_FOUND", "Endpoint not found")
		}
	})))

	// Calendar Aggregator Endpoints
	mux.Handle("/api/v1/calendar", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			calendarHandler.GetMonth(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/calendar/", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			calendarHandler.GetDate(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))

	// Insights Endpoints
	mux.Handle("/api/v1/insights/cycle", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			insightsHandler.GetCycleInsights(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/insights/wellness", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			insightsHandler.GetWellnessInsights(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/insights/fitness", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			insightsHandler.GetFitnessInsights(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/insights/nutrition", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			insightsHandler.GetNutritionInsights(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))

	// Gamification Endpoints (Stage 5 & Stage 6)
	mux.Handle("/api/v1/gamification", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			gamificationHandler.GetGamification(w, r)
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))
	mux.Handle("/api/v1/gamification/quests/", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			if strings.HasSuffix(r.URL.Path, "/swap") || strings.HasSuffix(r.URL.Path, "/skip") {
				gamificationHandler.SwapQuest(w, r)
			} else {
				gamificationHandler.CompleteQuest(w, r)
			}
		} else {
			models.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		}
	})))

	// Wrap middleware chain (CORS -> Logger -> Recoverer)
	handler := middleware.CORS(middleware.Logger(middleware.Recoverer(mux)))

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      handler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("[URJAA] API listening and serving at http://localhost:%s", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("[URJAA] Shutting down server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("[URJAA] Server exiting cleanly.")
}
