package calendar

import (
	"fmt"
	"strings"
	"time"

	"urjaa-backend/internal/cycle"
	"urjaa-backend/internal/database"
)

type Service struct {
	DB           *database.DB
	CycleService *cycle.Service
}

func NewService(db *database.DB, cycleSvc *cycle.Service) *Service {
	return &Service{
		DB:           db,
		CycleService: cycleSvc,
	}
}

// BuildMonthView aggregates all calendar dimensions for a given month YYYY-MM
func (s *Service) BuildMonthView(userID string, monthStr string, filter CalendarFilter) (*MonthSummary, error) {
	if monthStr == "" {
		monthStr = time.Now().Format("2006-01")
	}

	monthTime, err := time.Parse("2006-01", monthStr)
	if err != nil {
		monthTime = time.Now()
		monthStr = monthTime.Format("2006-01")
	}

	year, month, _ := monthTime.Date()
	firstOfMonth := time.Date(year, month, 1, 0, 0, 0, 0, time.UTC)
	lastOfMonth := firstOfMonth.AddDate(0, 1, -1)
	daysInMonth := lastOfMonth.Day()

	todayStr := time.Now().Format("2006-01-02")
	todayTime, _ := time.Parse("2006-01-02", todayStr)

	settings := s.DB.Storage.CycleSettings[userID]
	history := s.DB.Storage.Cycles[userID]
	userCheckins := s.DB.Storage.Checkins[userID]
	userSessions := s.DB.Storage.Sessions[userID]
	userMeals := s.DB.Storage.MealLogs[userID]

	days := make([]*CalendarDay, 0, daysInMonth)
	totalScoreAccum := 0
	daysWithActivity := 0

	for d := 1; d <= daysInMonth; d++ {
		currentDate := time.Date(year, month, d, 0, 0, 0, 0, time.UTC)
		dateStr := currentDate.Format("2006-01-02")
		isFuture := currentDate.After(todayTime)
		isToday := dateStr == todayStr

		calDay := &CalendarDay{
			Date:            dateStr,
			DayOfMonth:      d,
			DayOfWeek:       currentDate.Weekday().String()[:3],
			IsFuture:        isFuture,
			IsToday:         isToday,
			WorkoutStatus:   "NONE",
			NutritionStatus: "Not logged",
			WaterTargetML:   2000,
		}

		// 1. Calculate Cycle Phase & Day
		if settings != nil {
			if pInfo, err := s.CycleService.CalculatePhase(settings, history, currentDate); err == nil {
				calDay.CycleDay = pInfo.CycleDay
				calDay.EstimatedPhase = pInfo.CurrentPhase

				if pInfo.CurrentPhase == cycle.PhaseMenstrual {
					if isFuture {
						calDay.IsEstimatedPeriod = true
					} else {
						calDay.IsPeriod = true
					}
				}
				if pInfo.CurrentPhase == cycle.PhaseOvulatory {
					calDay.IsOvulationWindow = true
				}
			}
		}

		// 2. Overlay Check-in Data
		if userCheckins != nil && userCheckins[dateStr] != nil {
			chk := userCheckins[dateStr]
			calDay.CheckinCompleted = true
			calDay.Mood = chk.Mood
			calDay.Energy = chk.Energy
			calDay.Sleep = chk.Sleep
			calDay.Bloating = chk.Bloating
			calDay.Cramps = chk.Cramps
			calDay.WaterML = chk.WaterML
			calDay.WaterPercentage = int((float64(chk.WaterML) / float64(calDay.WaterTargetML)) * 100)

			if chk.NutritionAdherence != "" {
				calDay.NutritionStatus = chk.NutritionAdherence
			}

			if strings.Contains(chk.BleedingStatus, "started") || strings.Contains(chk.BleedingStatus, "continuing") {
				calDay.IsPeriod = true
				calDay.IsEstimatedPeriod = false
			}
		}

		// 3. Overlay Workout Data
		if userSessions != nil {
			for _, sess := range userSessions {
				if sess.ScheduledDate == dateStr {
					calDay.WorkoutStatus = sess.Status
					calDay.WorkoutTitle = sess.WorkoutTitle
					calDay.WorkoutMinutes = sess.DurationSeconds / 60
					break
				}
			}
		}

		// 4. Overlay Nutrition Meals
		if userMeals != nil {
			mCount := 0
			for key, done := range userMeals {
				if strings.HasPrefix(key, dateStr) && done {
					mCount++
				}
			}
			calDay.MealsCompleted = mCount
			if mCount >= 3 {
				calDay.NutritionStatus = "Followed"
			} else if mCount > 0 {
				calDay.NutritionStatus = "Partial"
			}
		}

		// 5. Compute Daily Consistency Score (Weighted per §10)
		score := 0
		if calDay.CheckinCompleted {
			score += 30
		}
		if calDay.WorkoutStatus == "COMPLETED" {
			score += 35
		}
		if calDay.NutritionStatus == "Followed" {
			score += 20
		} else if calDay.NutritionStatus == "Partial" {
			score += 10
		}
		if calDay.WaterPercentage >= 80 {
			score += 15
		} else if calDay.WaterPercentage >= 50 {
			score += 10
		}
		calDay.ConsistencyScore = score

		if !isFuture {
			totalScoreAccum += score
			daysWithActivity++
		}

		days = append(days, calDay)
	}

	// Calculate streaks & supportive tone message
	checkinStreak, workoutStreak, hydrationStreak := s.calculateStreaks(days, todayStr)
	overallConsistency := 0
	if daysWithActivity > 0 {
		overallConsistency = totalScoreAccum / daysWithActivity
	}

	supportiveMsg := "Every small step counts. You're building a sustainable wellness rhythm."
	if checkinStreak >= 3 {
		supportiveMsg = fmt.Sprintf("Great consistency! %d-day check-in momentum.", checkinStreak)
	}

	return &MonthSummary{
		Month:                   monthStr,
		DaysInMonth:             daysInMonth,
		Days:                    days,
		ActiveFilter:            filter,
		CheckinStreakDays:       checkinStreak,
		WorkoutStreakDays:       workoutStreak,
		HydrationStreak:         hydrationStreak,
		OverallConsistencyScore: overallConsistency,
		SupportiveStreakMessage: supportiveMsg,
	}, nil
}

func (s *Service) calculateStreaks(days []*CalendarDay, todayStr string) (int, int, int) {
	cStreak, wStreak, hStreak := 0, 0, 0

	// Walk backwards from today or yesterday
	todayIdx := -1
	for i, d := range days {
		if d.Date == todayStr {
			todayIdx = i
			break
		}
	}

	if todayIdx == -1 {
		return 0, 0, 0
	}

	for i := todayIdx; i >= 0; i-- {
		if days[i].CheckinCompleted {
			cStreak++
		} else if i < todayIdx {
			break
		}
	}

	for i := todayIdx; i >= 0; i-- {
		if days[i].WorkoutStatus == "COMPLETED" {
			wStreak++
		} else if i < todayIdx {
			break
		}
	}

	for i := todayIdx; i >= 0; i-- {
		if days[i].WaterPercentage >= 80 {
			hStreak++
		} else if i < todayIdx {
			break
		}
	}

	return cStreak, wStreak, hStreak
}
