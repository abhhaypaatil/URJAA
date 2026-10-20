import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { RecommendedMeal, Meal, PhaseType, DietaryPreference } from '../types';
import { MealCard } from '../components/nutrition/MealCard';
import { SubstitutionModal } from '../components/nutrition/SubstitutionModal';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  UtensilsCrossed,
  Sparkles,
  CheckCircle2,
  Clock,
  Leaf,
  Apple,
  Info,
  Layers,
} from 'lucide-react';
import { MEDICAL_DISCLAIMER, DIETARY_PREFERENCES } from '../constants';

export const NutritionPage: React.FC = () => {
  const [meals, setMeals] = useState<RecommendedMeal[]>([]);
  const [phase, setPhase] = useState<PhaseType>('Follicular');
  const [dietPref, setDietPref] = useState<DietaryPreference>('Vegetarian');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [substituteMeal, setSubstituteMeal] = useState<Meal | null>(null);

  const loadNutritionData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getTodayNutrition();
      setMeals(data.meals || []);
      setPhase(data.phase_target || data.phase || 'Follicular');
      setDietPref(data.dietary_preference || 'Vegetarian');
    } catch (err: any) {
      console.error('Failed to load nutrition data', err);
      setError(err.message || 'Could not load meals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNutritionData();
  }, []);

  const handleToggleMeal = async (mealId: string) => {
    try {
      await api.toggleMealComplete(mealId);
      setMeals((prev) =>
        prev.map((item) =>
          item.meal.id === mealId ? { ...item, completed: !item.completed } : item
        )
      );
    } catch (err) {
      console.error('Failed to toggle meal', err);
    }
  };

  const completedCount = meals.filter((m) => m.completed).length;
  const progressPercent = meals.length > 0 ? Math.round((completedCount / meals.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-28 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-44 rounded-3xl" />
          <Skeleton className="h-44 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadNutritionData} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header: Food & Nutrition Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="uppercase tracking-widest text-[10px]">Cycle-Aware Nourishment</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
            Nourish Your Rhythm
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Whole-food meals calibrated to support liver estrogen clearance, steady blood sugar, and sustained vitality.
          </p>
        </div>

        {/* Dietary preference badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-sage-50 dark:bg-sage-950/40 border border-sage-200/80 dark:border-sage-900/60 text-xs font-semibold text-sage-800 dark:text-sage-200 shadow-subtle w-fit">
          <UtensilsCrossed className="w-3.5 h-3.5 text-sage-600" />
          <span>{dietPref} • {phase} Phase Plan</span>
        </div>
      </div>

      {/* Daily Progress & Macronutrient Composition Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daily Meal Adherence
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {completedCount} of {meals.length} meals enjoyed today ({progressPercent}%)
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/60 w-fit">
            {progressPercent === 100 ? 'All Meals Complete' : `${progressPercent}% On Track`}
          </span>
        </div>

        <ProgressBar progress={progressPercent} colorClass="bg-emerald-600" height="h-2.5" />

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>No Calorie Counting</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>1-Tap Clean Ingredient Swaps</span>
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Phase Target: High Folate, Zinc & Prebiotics
          </span>
        </div>
      </div>

      {/* 4 Meals Grid (Breakfast, Lunch, Snack, Dinner) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Today's Meal Course</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meals.map((item) => (
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

      {/* Nutritional Guidance Philosophy Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/60 dark:bg-slate-900/60 border border-amber-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-subtle">
        <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 mb-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Practical, Respectful Nutrition Philosophy</span>
        </div>
        <p>
          Urjaa recommends bioavailable sources of complete protein, low-glycemic complex carbohydrates, gentle dietary fiber, and healthy omega fats tailored to your hormonal cycle phase. We do not promote restrictive dieting or extreme fasting during progesterone rise.
        </p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
          {MEDICAL_DISCLAIMER}
        </p>
      </div>

      {/* Substitution Modal */}
      <SubstitutionModal
        isOpen={!!substituteMeal}
        onClose={() => setSubstituteMeal(null)}
        meal={substituteMeal}
        onSelectSubstitute={(title) => {
          if (substituteMeal) {
            setMeals((prev) =>
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
