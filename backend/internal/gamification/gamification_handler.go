package gamification

import (
	"net/http"
	"strings"
	"time"

	"urjaa-backend/internal/database"
	"urjaa-backend/internal/middleware"
	"urjaa-backend/internal/models"
)

var LevelTitles = []string{
	"Gentle Spark",
	"Mindful Bloom",
	"Radiant Rhythm",
	"Steady Harmony",
	"Vital Flow",
	"Solar Alchemist",
	"Inner Luminary",
}

func CalculateLevel(totalXP int) (int, string, int, int) {
	level := 1
	remaining := totalXP
	required := 200

	for remaining >= required {
		remaining -= required
		level++
		required = int(float64(required) * 1.25)
	}

	titleIndex := level - 1
	if titleIndex >= len(LevelTitles) {
		titleIndex = len(LevelTitles) - 1
	}
	return level, LevelTitles[titleIndex], remaining, required
}

type Handler struct {
	DB *database.DB
}

func NewHandler(db *database.DB) *Handler {
	return &Handler{DB: db}
}

func (h *Handler) generatePersonalizedQuests(userID string, date string) []*models.Quest {
	profile := h.DB.Storage.Profiles[userID]
	primaryGoal := ""
	fitnessLevel := "Beginner"
	if profile != nil {
		primaryGoal = profile.PrimaryGoal
		if primaryGoal == "" {
			primaryGoal = profile.WellnessGoal
		}
		if profile.FitnessLevel != "" {
			fitnessLevel = profile.FitnessLevel
		}
	}

	movementTitle := "Daily Movement Flow"
	movementDesc := "Complete today's phase-aligned movement session or gentle stretch."
	movementExerciseID := "22222222-0000-0000-0000-000000000007" // Bodyweight Squats
	movementCategory := "movement"
	movementDuration := 15

	if strings.Contains(strings.ToLower(primaryGoal), "strength") {
		movementTitle = "Targeted Strength Progression"
		movementDesc = "Complete 3 controlled sets of bodyweight squats and push-up progressions."
		movementExerciseID = "22222222-0000-0000-0000-000000000007"
		movementCategory = "strength"
		movementDuration = 20
	} else if strings.Contains(strings.ToLower(primaryGoal), "flexibility") || strings.Contains(strings.ToLower(primaryGoal), "mobility") {
		movementTitle = "Spine & Pelvic Mobility Flow"
		movementDesc = "Gentle cat-cow waves and hip releases to relieve back tension."
		movementExerciseID = "22222222-0000-0000-0000-000000000042" // Cat-Cow
		movementCategory = "flexibility"
		movementDuration = 12
	} else if strings.Contains(strings.ToLower(primaryGoal), "stress") || strings.Contains(strings.ToLower(primaryGoal), "relax") {
		movementTitle = "Nervous System Restorative Flow"
		movementDesc = "Calming diaphragmatic breathing and child's pose pelvic release."
		movementExerciseID = "22222222-0000-0000-0000-000000000043" // Child's Pose
		movementCategory = "mindfulness"
		movementDuration = 10
	} else if strings.Contains(strings.ToLower(primaryGoal), "stamina") || strings.Contains(strings.ToLower(primaryGoal), "cardio") {
		movementTitle = "Low-Impact Cardio Activation"
		movementDesc = "Invigorating step-jacks and rhythmic marches without joint impact."
		movementExerciseID = "22222222-0000-0000-0000-000000000007"
		movementCategory = "movement"
		movementDuration = 15
	}

	completions := h.DB.Storage.QuestCompletions[userID]
	isCompleted := func(qID string) bool {
		if completions == nil {
			return false
		}
		return completions[date+"_"+qID]
	}

	return []*models.Quest{
		{
			ID:          "quest-movement",
			Title:       movementTitle,
			Description: movementDesc,
			Category:    movementCategory,
			Difficulty:  fitnessLevel,
			DurationMin: movementDuration,
			XPReward:    80,
			Completed:   isCompleted("quest-movement"),
			ActionLabel: "View Exercise Demo",
			ActionRoute: "/workout",
			ExerciseID:  movementExerciseID,
			AssetKey:    "quest-kinetic-spark",
		},
		{
			ID:          "quest-hydration",
			Title:       "Mindful Hydration Intention",
			Description: "Log at least 500ml of water to support cellular hydration and hormone clearance.",
			Category:    "hydration",
			Difficulty:  "Beginner",
			DurationMin: 2,
			XPReward:    40,
			Completed:   isCompleted("quest-hydration"),
			ActionLabel: "Log Water",
			ActionRoute: "/check-in",
			AssetKey:    "quest-hydration-glow",
		},
		{
			ID:          "quest-nourish",
			Title:       "Phase-Aligned Indian Nourishment",
			Description: "Explore today's wholesome Indian meal suggestions and log your plate or 1-tap swap.",
			Category:    "nutrition",
			Difficulty:  "Beginner",
			DurationMin: 5,
			XPReward:    60,
			Completed:   isCompleted("quest-nourish"),
			ActionLabel: "View Meal Plan",
			ActionRoute: "/nutrition",
			MealID:      "44444444-0000-0000-0000-000000000001",
			AssetKey:    "quest-alchemy-plate",
		},
		{
			ID:          "quest-evening",
			Title:       "Restorative Wellness Pulse",
			Description: "Complete your 20-second evening wellness check-in to record energy and sleep quality.",
			Category:    "mindfulness",
			Difficulty:  "Beginner",
			DurationMin: 2,
			XPReward:    50,
			Completed:   isCompleted("quest-evening"),
			ActionLabel: "Complete Check-in",
			ActionRoute: "/check-in",
			ExerciseID:  "22222222-0000-0000-0000-000000000043",
			AssetKey:    "quest-evening-unwind",
		},
	}
}

// GET /api/v1/gamification
func (h *Handler) GetGamification(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	today := time.Now().Format("2006-01-02")
	state := h.DB.Storage.GamificationStates[userID]

	if state == nil {
		// Fresh user: Zero-state initializations
		lvl, title, curXP, nextXP := CalculateLevel(0)
		state = &models.GamificationState{
			UserID:         userID,
			Level:          lvl,
			LevelTitle:     title,
			CurrentXP:      curXP,
			XPForNextLevel: nextXP,
			TotalXPEarned:  0,
			StreakDays:     1,
			Quests:         h.generatePersonalizedQuests(userID, today),
			LastActiveDate: today,
		}
		h.DB.Storage.GamificationStates[userID] = state
	} else if state.LastActiveDate != today {
		// New day: refresh quests but strictly preserve lifetime XP and Level!
		lvl, title, curXP, nextXP := CalculateLevel(state.TotalXPEarned)
		state.Level = lvl
		state.LevelTitle = title
		state.CurrentXP = curXP
		state.XPForNextLevel = nextXP
		state.Quests = h.generatePersonalizedQuests(userID, today)
		state.LastActiveDate = today
	} else {
		// Ensure quests reflect current completion status
		for _, q := range state.Quests {
			if h.DB.Storage.QuestCompletions[userID] != nil && h.DB.Storage.QuestCompletions[userID][today+"_"+q.ID] {
				q.Completed = true
			}
		}
	}

	models.RespondJSON(w, http.StatusOK, state)
}

// POST /api/v1/gamification/quests/{id}/complete
func (h *Handler) CompleteQuest(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		models.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authorized")
		return
	}

	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	var questID string
	for i, part := range pathParts {
		if part == "quests" && i+1 < len(pathParts) {
			questID = pathParts[i+1]
			break
		}
	}

	if questID == "" {
		models.RespondError(w, http.StatusBadRequest, "BAD_REQUEST", "Quest ID required")
		return
	}

	today := time.Now().Format("2006-01-02")
	if h.DB.Storage.QuestCompletions[userID] == nil {
		h.DB.Storage.QuestCompletions[userID] = make(map[string]bool)
	}

	completionKey := today + "_" + questID

	state := h.DB.Storage.GamificationStates[userID]
	if state == nil {
		lvl, title, curXP, nextXP := CalculateLevel(0)
		state = &models.GamificationState{
			UserID:         userID,
			Level:          lvl,
			LevelTitle:     title,
			CurrentXP:      curXP,
			XPForNextLevel: nextXP,
			TotalXPEarned:  0,
			StreakDays:     1,
			Quests:         h.generatePersonalizedQuests(userID, today),
			LastActiveDate: today,
		}
		h.DB.Storage.GamificationStates[userID] = state
	}

	// Idempotent check: prevent double-rewarding XP
	if h.DB.Storage.QuestCompletions[userID][completionKey] {
		models.RespondJSON(w, http.StatusOK, map[string]interface{}{
			"state":      state,
			"earned_xp":  0,
			"leveled_up": false,
			"message":    "Quest already completed for today",
		})
		return
	}

	var earnedXP int
	for _, q := range state.Quests {
		if q.ID == questID {
			q.Completed = true
			q.CompletedAt = time.Now().Format(time.RFC3339)
			earnedXP = q.XPReward
			break
		}
	}

	if earnedXP == 0 {
		earnedXP = 50 // default fallback reward if custom quest ID
	}

	oldLevel := state.Level
	state.TotalXPEarned += earnedXP

	newLevel, title, curXP, nextXP := CalculateLevel(state.TotalXPEarned)
	state.Level = newLevel
	state.LevelTitle = title
	state.CurrentXP = curXP
	state.XPForNextLevel = nextXP
	state.LastActiveDate = today

	h.DB.Storage.QuestCompletions[userID][completionKey] = true

	leveledUp := newLevel > oldLevel

	models.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"state":      state,
		"earned_xp":  earnedXP,
		"leveled_up": leveledUp,
		"message":    "Quest completed successfully",
	})
}
