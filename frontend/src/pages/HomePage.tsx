import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAvatar } from '../context/AvatarContext';
import { api } from '../api/client';
import {
  PhaseInfo,
  DailyCheckin,
  DailyRecommendation,
  RecommendedMeal,
  Meal,
} from '../types';
import {
  DEMO_PHASE_INFO,
  DEMO_RECOMMENDATION,
  DEMO_MEALS,
} from '../api/mockData';
import { PhaseBadge } from '../components/cycle/PhaseBadge';
import { CycleRing } from '../components/cycle/CycleRing';
import { PeriodLoggerModal } from '../components/cycle/PeriodLoggerModal';
import { DailyLifeSyncForecast } from '../components/cycle/DailyLifeSyncForecast';
import { WorkoutCard } from '../components/workout/WorkoutCard';
import { WaterTracker } from '../components/checkin/WaterTracker';
import { MealCard } from '../components/nutrition/MealCard';
import { SubstitutionModal } from '../components/nutrition/SubstitutionModal';
import { CompanionDrawer } from '../components/companion/CompanionDrawer';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  Heart,
  Flame,
  UtensilsCrossed,
  Activity,
  Calendar as CalendarIcon,
  CheckCircle2,
  Smile,
  BatteryCharging,
  ArrowRight,
  MessageCircle,
  Plus,
  Droplets,
  Sparkles,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, hasSettings } = useAuth();
  const { avatar } = useAvatar();

  const [phaseInfo, setPhaseInfo] = useState<PhaseInfo | null>(DEMO_PHASE_INFO);
  const [recommendation, setRecommendation] = useState<DailyRecommendation | null>(DEMO_RECOMMENDATION);
  const [todayCheckin, setTodayCheckin] = useState<DailyCheckin | null>(null);
  const [todayMeals, setTodayMeals] = useState<RecommendedMeal[]>(DEMO_MEALS);
  const [waterML, setWaterML] = useState<number>(1200);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isPeriodLoggerOpen, setIsPeriodLoggerOpen] = useState<boolean>(false);
  const [substituteMeal, setSubstituteMeal] = useState<Meal | null>(null);
  const [isCompanionOpen, setIsCompanionOpen] = useState<boolean>(false);

  const loadDashboardData = async () => {
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
        setWaterML(checkinData.checkin.water_ml || 1200);
      }

      // 3. Recommended workout
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
      console.warn('Notice loading dashboard updates:', err);
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

  const greetingName = profile?.name || 'Maya';
  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Welcoming Lifestyle Greeting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-rose-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
            {avatar.generatedAvatarUrl || avatar.sourceImage ? (
              <img
                src={avatar.generatedAvatarUrl || avatar.sourceImage}
                alt={greetingName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-serif font-bold text-xl text-rose-600 dark:text-rose-400">
                {greetingName[0]}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {todayDateFormatted}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                {phaseInfo?.current_phase || 'Follicular'} Phase
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">
              Good day, {greetingName}
            </h1>
          </div>
        </div>

        {/* Quick Check-in & Assistant Actions */}
        <div className="flex items-center gap-2.5">
          <Link to="/check-in">
            <Button
              variant={todayCheckin ? 'outline' : 'rose'}
              size="sm"
              leftIcon={
                todayCheckin ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Activity className="w-4 h-4" />
                )
              }
            >
              {todayCheckin ? 'Check-in Logged' : '20s Check-in'}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCompanionOpen(true)}
            leftIcon={<MessageCircle className="w-4 h-4 text-rose-500" />}
          >
            Ask Assistant
          </Button>
        </div>
      </div>

      {/* 2. Cycle Intelligence & Daily Focus Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Cycle Ring (4 cols) */}
        <Card className="md:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800">
          <CycleRing
            currentDay={phaseInfo?.cycle_day || 1}
            totalDays={phaseInfo?.total_cycle_length || 28}
            phase={phaseInfo?.current_phase || 'Follicular'}
            estimatedNextPeriodDays={phaseInfo?.days_until_next_period || 20}
            onLogClick={() => setIsPeriodLoggerOpen(true)}
          />
          {phaseInfo && (
            <div className="mt-3">
              <PhaseBadge
                phase={phaseInfo.current_phase}
                confidenceLabel={phaseInfo.confidence_label}
              />
            </div>
          )}
        </Card>

        {/* Right: Today's Biological Rhythm Insight (8 cols) */}
        <Card variant="rose" className="md:col-span-8 flex flex-col justify-between p-6">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Hormonal Rhythm
                </span>
                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">
                  Day {phaseInfo?.cycle_day} • {phaseInfo?.current_phase} Phase
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full border border-slate-200/80 dark:border-slate-800">
                {recommendation?.intensity_level || 'Moderate'} Energy
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
              {phaseInfo?.phase_description ||
                'Your hormonal rhythms are guiding your natural energy and recovery needs today.'}
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-rose-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Today's Suggested Focus:</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 pl-5 leading-relaxed">
                {phaseInfo?.recommended_focus ||
                  'Restorative movement, balanced whole foods, and ample hydration.'}
              </p>
            </div>
          </div>

          {/* Quick Stats Footer */}
          <div className="mt-4 pt-3.5 border-t border-rose-200/50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-amber-500" />
                <span>{todayCheckin?.mood ? `Mood: ${todayCheckin.mood}` : 'Mood not logged'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                <span>{todayCheckin?.energy ? `Energy: ${todayCheckin.energy}` : 'Energy not logged'}</span>
              </span>
            </div>

            <Link
              to="/cycle"
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 inline-flex items-center gap-1"
            >
              <span>Cycle Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Daily Life-Sync Forecast (Work, Movement, Nutrition, Skin & Social) */}
      <DailyLifeSyncForecast
        phase={phaseInfo?.current_phase || 'Follicular'}
        cycleDay={phaseInfo?.cycle_day || 9}
      />

      {/* 3. Movement & Fitness Section (Athletic Personality) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-600" />
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

      {/* 4. Food & Nutrition Section (Warm Culinary Personality) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-sage-600" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Today's Nourishment Plan
            </h3>
          </div>
          <Link
            to="/nutrition"
            className="text-xs font-semibold text-sage-700 dark:text-sage-400 hover:underline inline-flex items-center gap-1"
          >
            <span>All Meals</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recommendation?.nutrition_focus && (
          <div className="p-3.5 rounded-2xl bg-sage-50 dark:bg-sage-950/30 border border-sage-200/80 dark:border-sage-900/60 text-xs text-sage-800 dark:text-sage-200">
            <span className="font-bold">Nutrition Focus: </span>
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

      {/* 5. Hydration & Daily Check-in Card */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Daily Water & Habit Tracking
          </h3>
        </div>

        <Card className="p-5 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800">
          <WaterTracker
            waterML={waterML}
            targetML={recommendation?.hydration_target_ml || 2200}
            onAddWater={handleAddWater}
            onSetWater={handleSetWater}
          />
        </Card>
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

      <CompanionDrawer
        isOpen={isCompanionOpen}
        onClose={() => setIsCompanionOpen(false)}
        context={{
          userName: greetingName,
          phase: phaseInfo?.current_phase || 'Follicular',
          cycleDay: phaseInfo?.cycle_day || 9,
          energyLevel: todayCheckin?.energy || 'High',
          hydrationML: waterML,
        }}
      />
    </div>
  );
};
