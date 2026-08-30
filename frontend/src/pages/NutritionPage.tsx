import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { RecommendedMeal, Meal, PhaseType } from '../types';
import { MealCard } from '../components/nutrition/MealCard';
import { SubstitutionModal } from '../components/nutrition/SubstitutionModal';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { UtensilsCrossed, Sparkles, CheckCircle2 } from 'lucide-react';
import { MEDICAL_DISCLAIMER } from '../constants';

export const NutritionPage: React.FC = () => {
  const [meals, setMeals] = useState<RecommendedMeal[]>([]);
  const [phase, setPhase] = useState<PhaseType>('Menstrual');
  const [dietPref, setDietPref] = useState<string>('Vegetarian');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [substituteMeal, setSubstituteMeal] = useState<Meal | null>(null);

  const loadNutritionData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getTodayNutrition();
      setMeals(data.meals || []);
      setPhase(data.phase || 'Menstrual');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-sage-600 dark:text-sage-400">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Cycle-Aware Nourishment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">
            Today's Nutrition Plan
          </h1>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-sage-50 text-sage-700 dark:bg-sage-950/60 dark:text-sage-300 border border-sage-200 dark:border-sage-900 w-fit">
          {dietPref} • {phase} Phase
        </span>
      </div>

      {/* Progress & Adherence Card */}
      <Card variant="flat" className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-soft">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sage-600" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Daily Meal Coverage
            </span>
          </div>
          <span className="text-xs font-bold text-sage-600 dark:text-sage-400">
            {completedCount} of {meals.length} Meals Followed ({progressPercent}%)
          </span>
        </div>
        <ProgressBar progress={progressPercent} colorClass="bg-sage-600" height="h-2.5" />
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
          No calorie counting — focus on nutrient quality, fiber, protein, and gentle hydration.
        </p>
      </Card>

      {/* Meals Grid (4 Slots: Breakfast, Lunch, Snack, Dinner) */}
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

      {/* Philosophy & Disclaimer Footer */}
      <Card className="p-4 bg-warm-50/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 mb-1">
          <Sparkles className="w-4 h-4 text-rose-500" />
          <span>Practical & Respectful Nutrition</span>
        </div>
        <p>
          Urjaa provides practical sources of protein, complex carbs, iron, and healthy fats tailored to your hormonal cycle phase. Conflicting foods are never recommended.
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
          {MEDICAL_DISCLAIMER}
        </p>
      </Card>

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
