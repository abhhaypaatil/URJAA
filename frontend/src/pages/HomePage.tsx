import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  PhaseInfo,
  DailyCheckin,
  DailyRecommendation,
  RecommendedMeal,
} from '../types';
import { PhaseBadge } from '../components/cycle/PhaseBadge';
import { CycleRing } from '../components/cycle/CycleRing';
import { PeriodLoggerModal } from '../components/cycle/PeriodLoggerModal';
import { WorkoutCard } from '../components/workout/WorkoutCard';
import { WaterTracker } from '../components/checkin/WaterTracker';
import { MealCard } from '../components/nutrition/MealCard';
import { SubstitutionModal } from '../components/nutrition/SubstitutionModal';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  Sparkles,
  Calendar as CalendarIcon,
  CheckCircle2,
  Smile,
  BatteryCharging,
  Moon,
  ArrowRight,
  Flame,
  UtensilsCrossed,
} from 'lucide-react';
import { Meal } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, hasSettings } = useAuth();

  const [phaseInfo, setPhaseInfo] = useState<PhaseInfo | null>(null);
  const [recommendation, setRecommendation] = useState<DailyRecommendation | null>(null);
  const [todayCheckin, setTodayCheckin] = useState<DailyCheckin | null>(null);
  const [todayMeals, setTodayMeals] = useState<RecommendedMeal[]>([]);
  const [waterML, setWaterML] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isPeriodLoggerOpen, setIsPeriodLoggerOpen] = useState<boolean>(false);
  const [substituteMeal, setSubstituteMeal] = useState<Meal | null>(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Cycle info
      const cycleData = await api.getCurrentCycle().catch(() => null);
      if (cycleData?.phase_info) {
        setPhaseInfo(cycleData.phase_info);
      }

      // 2. Today's Checkin
      const checkinData = await api.getTodayCheckin().catch(() => null);
      if (checkinData?.checkin) {
        setTodayCheckin(checkinData.checkin);
        setWaterML(checkinData.checkin.water_ml || 0);
      }

      // 3. Recommended workout & recovery
      const recData = await api.getRecommendedWorkout().catch(() => null);
      if (recData) {
        setRecommendation(recData);
      }

      // 4. Today's meals
      const nutData = await api.getTodayNutrition().catch(() => null);
      if (nutData?.meals) {
        setTodayMeals(nutData.meals);
      }
    } catch (err: any) {
      console.error('Error loading dashboard', err);
      setError(err.message || 'Could not load today\'s plan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasSettings && user) {
      navigate('/onboarding');
      return;
    }
    loadDashboardData();
  }, [hasSettings, user]);

  const handleAddWater = async (amount: number) => {
    const nextVal = waterML + amount;
    setWaterML(nextVal);
    try {
      await api.saveCheckin({
        water_ml: nextVal,
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error('Failed to update water', err);
    }
  };

  const handleSetWater = async (total: number) => {
    setWaterML(total);
    try {
      await api.saveCheckin({
        water_ml: total,
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error('Failed to set water', err);
    }
  };

  const handleToggleMeal = async (mealId: string) => {
    try {
      await api.toggleMealComplete(mealId);
      setTodayMeals((prev) =>
        prev.map((item) =>
          item.meal.id === mealId ? { ...item, completed: !item.completed } : item
        )
      );
    } catch (err) {
      console.error('Failed to toggle meal', err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl md:col-span-2" />
        </div>
        <Skeleton className="h-48 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboardData} />;
  }

  const greetingName = profile?.name || 'there';

  return (
    <div className="space-y-6">
      {/* 1. Header: Greeting & Quick Check-in CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Today's Cycle Awareness</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">
            Welcome, {greetingName}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/check-in">
            <Button
              variant={todayCheckin ? 'outline' : 'rose'}
              size="sm"
              leftIcon={todayCheckin ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : undefined}
            >
              {todayCheckin ? 'Edit Daily Check-in' : '20s Daily Check-in'}
            </Button>
          </Link>
          <Link to="/calendar">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CalendarIcon className="w-4 h-4 text-slate-500" />}
              title="View calendar visual history"
            >
              Calendar
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Top Grid: Cycle State & Daily Phase Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Cycle Ring (4 cols) */}
        <Card className="md:col-span-4 flex flex-col items-center justify-center text-center p-6">
          <CycleRing
            currentDay={phaseInfo?.cycle_day || 1}
            totalDays={phaseInfo?.total_cycle_length || 28}
            phase={phaseInfo?.current_phase || 'Menstrual'}
            estimatedNextPeriodDays={phaseInfo?.days_until_next_period || 20}
            onLogClick={() => setIsPeriodLoggerOpen(true)}
          />
          {phaseInfo && (
            <div className="mt-2">
              <PhaseBadge
                phase={phaseInfo.current_phase}
                confidenceLabel={phaseInfo.confidence_label}
              />
            </div>
          )}
        </Card>

        {/* Right: Today's Wellness & Focus Card (8 cols) */}
        <Card variant="gradient" className="md:col-span-8 flex flex-col justify-between p-6">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Phase Understanding
                </span>
                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">
                  {phaseInfo?.current_phase} Rhythm
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-800/70 px-3 py-1 rounded-full border border-slate-200/60 dark:border-slate-700/60">
                {recommendation?.intensity_level || 'Gentle'} Pacing
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
              {phaseInfo?.phase_description ||
                'Your hormonal rhythms are guiding your natural energy and recovery needs today.'}
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-rose-700 dark:text-rose-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Today's Recommended Focus:</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 pl-5">
                {phaseInfo?.recommended_focus || 'Restorative movement, balanced whole foods, and ample hydration.'}
              </p>
            </div>
          </div>

          {/* Quick Symptoms / Checkin Pill bar */}
          <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-amber-500" />
                <span>{todayCheckin?.mood ? `Mood: ${todayCheckin.mood}` : 'Mood not logged'}</span>
              </span>
              <span className="flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                <span>{todayCheckin?.energy ? `Energy: ${todayCheckin.energy}` : 'Energy not logged'}</span>
              </span>
            </div>

            <Link
              to="/cycle"
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 inline-flex items-center gap-1"
            >
              <span>Cycle Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>
      </div>

      {/* 3. Daily Hydration Widget */}
      <Card className="p-5">
        <WaterTracker
          waterML={waterML}
          targetML={recommendation?.hydration_target_ml || 2000}
          onAddWater={handleAddWater}
          onSetWater={handleSetWater}
        />
      </Card>

      {/* 4. Workout Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Today's Recommended Movement
            </h3>
          </div>
          <Link
            to="/workout"
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Workout Library</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recommendation?.workout ? (
          <WorkoutCard
            workout={recommendation.workout}
            isRecommended={true}
            onStart={() => navigate(`/workout/session/${recommendation.workout.id}`)}
          />
        ) : (
          <Card className="text-center p-6 text-xs text-slate-500">
            No specific workout recommended for today. Check the library for gentle stretches.
          </Card>
        )}
      </div>

      {/* 5. Today's Nutrition Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-sage-600" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Cycle-Aware Nutrition Plan
            </h3>
          </div>
          <Link
            to="/nutrition"
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Full Meal Plan</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recommendation?.nutrition_focus && (
          <div className="p-3.5 rounded-2xl bg-sage-50/70 dark:bg-sage-950/40 border border-sage-200/60 dark:border-sage-900/60 text-xs text-sage-800 dark:text-sage-200 mb-4">
            <span className="font-bold">Today's Focus: </span>
            {recommendation.nutrition_focus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {todayMeals.slice(0, 2).map((item) => (
            <MealCard
              key={item.meal.id}
              meal={item.meal}
              completed={item.completed}
              onToggleComplete={() => handleToggleMeal(item.meal.id)}
              onOpenSubstitute={() => setSubstituteMeal(item.meal)}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <PeriodLoggerModal
        isOpen={isPeriodLoggerOpen}
        onClose={() => setIsPeriodLoggerOpen(false)}
        onSuccess={loadDashboardData}
      />

      <SubstitutionModal
        isOpen={!!substituteMeal}
        onClose={() => setSubstituteMeal(null)}
        meal={substituteMeal}
        onSelectSubstitute={(title) => {
          if (substituteMeal) {
            setTodayMeals((prev) =>
              prev.map((item) =>
                item.meal.id === substituteMeal.id
                  ? { ...item, meal: { ...item.meal, title } }
                  : item
              )
            );
          }
        }}
      />
    </div>
  );
};
