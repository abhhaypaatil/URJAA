import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { RecommendedMeal, Meal, PhaseType, DietaryPreference } from '../types';
import { MealCard } from '../components/nutrition/MealCard';
import { SubstitutionModal } from '../components/nutrition/SubstitutionModal';
import { ProgressBar } from '../components/common/ProgressBar';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  UtensilsCrossed,
  Sparkles,
  CheckCircle2,
  Clock,
  Leaf,
  Info,
  RefreshCw,
  Heart,
} from 'lucide-react';
import { MEDICAL_DISCLAIMER, DIETARY_PREFERENCES } from '../constants';

export const NutritionPage: React.FC = () => {
  const { profile, refreshUserData } = useAuth();
  const [meals, setMeals] = useState<RecommendedMeal[]>([]);
  const [phase, setPhase] = useState<PhaseType>('Follicular');
  const [dietPref, setDietPref] = useState<DietaryPreference>(
    (profile?.dietary_preference as DietaryPreference) || 'Vegetarian'
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingDiet, setIsUpdatingDiet] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [substituteMeal, setSubstituteMeal] = useState<Meal | null>(null);

  const loadNutritionData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getTodayNutrition();
      setMeals(data.meals || []);
      setPhase(data.phase_target || data.phase || 'Follicular');
      if (data.dietary_preference) {
        setDietPref(data.dietary_preference as DietaryPreference);
      }
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

  const handleDietChange = async (newPref: DietaryPreference) => {
    setDietPref(newPref);
    setIsUpdatingDiet(true);
    try {
      await api.updateProfile({ dietary_preference: newPref });
      await refreshUserData();
      const data = await api.getTodayNutrition();
      setMeals(data.meals || []);
    } catch (err) {
      console.error('Failed to switch diet', err);
    } finally {
      setIsUpdatingDiet(false);
    }
  };

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
            <span className="uppercase tracking-widest text-[10px]">Practical Indian Nourishment</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-plum-950 dark:text-white tracking-tight">
            Nourish Your Body & Rhythm
          </h1>
          <p className="text-xs sm:text-sm text-plum-600 dark:text-slate-400 mt-1 max-w-2xl">
            Familiar Indian breakfast, main meal, and snack suggestions tailored to your dietary preference and cycle phase.
          </p>
        </div>

        {/* Dietary preference switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-urjaa-ivory dark:bg-slate-800 border border-plum-100 dark:border-slate-700">
          {(['Vegetarian', 'Non-vegetarian', 'Eggetarian', 'Vegan'] as DietaryPreference[]).map((pref) => (
            <button
              key={pref}
              type="button"
              disabled={isUpdatingDiet}
              onClick={() => handleDietChange(pref)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                dietPref === pref
                  ? 'bg-urjaa-pistachio text-plum-950 shadow-subtle'
                  : 'text-plum-600 dark:text-slate-400 hover:text-plum-950 dark:hover:text-white'
              }`}
            >
              {pref}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Progress & Indian Food Philosophy Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-plum-100/80 dark:border-slate-800 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-plum-950 dark:text-white">
                Daily Plate Balance
              </h3>
              <p className="text-xs text-plum-500 dark:text-slate-400">
                {completedCount} of {meals.length} meals enjoyed today ({progressPercent}%)
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/60 w-fit">
            {progressPercent === 100 ? 'All Meals Complete' : `${progressPercent}% On Track`}
          </span>
        </div>

        <ProgressBar progress={progressPercent} colorClass="bg-emerald-600" height="h-2.5" />

        <div className="mt-4 pt-4 border-t border-plum-100/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-plum-600 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>No Calorie Restricting</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>1-Tap Clean Ingredient Swaps</span>
            </span>
          </div>
          <span className="text-[11px] font-mono text-plum-500 dark:text-slate-400">
            Phase Target: {phase} Phase Micronutrient Balance
          </span>
        </div>
      </div>

      {/* Meals Grid (Breakfast, Lunch, Snack, Dinner) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-plum-950 dark:text-white">
            Today's Indian Meal Suggestions ({dietPref})
          </h3>
          <span className="text-xs text-plum-500 dark:text-slate-400">
            Tap card to swap ingredients
          </span>
        </div>

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

      {/* Practical Nutrition Philosophy & Disclaimers */}
      <div className="p-5 sm:p-6 rounded-3xl bg-urjaa-peach/30 dark:bg-slate-900/60 border border-urjaa-peach/70 dark:border-slate-800 text-xs text-plum-800 dark:text-slate-300 leading-relaxed shadow-subtle">
        <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 mb-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Familiar, Balanced Nutrition Without Guilt</span>
        </div>
        <p>
          Urjaa embraces traditional staples like dal, poha, idlis, chilla, khichdi, curd, and regional vegetables or lean proteins.
          We never prescribe extreme restriction, crash diets, or unverified hormonal cure claims. Micronutrient values shown are approximate estimates for educational inspiration.
        </p>
        <p className="text-[10px] text-plum-500 dark:text-slate-400 mt-2">
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
