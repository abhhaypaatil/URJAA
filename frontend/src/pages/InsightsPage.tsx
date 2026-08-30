import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Card } from '../components/common/Card';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  BarChart3,
  Heart,
  Flame,
  UtensilsCrossed,
  Droplet,
  Smile,
  BatteryCharging,
  Sparkles,
} from 'lucide-react';
import { MEDICAL_DISCLAIMER } from '../constants';

export const InsightsPage: React.FC = () => {
  const [cycleData, setCycleData] = useState<any>(null);
  const [wellnessData, setWellnessData] = useState<any>(null);
  const [fitnessData, setFitnessData] = useState<any>(null);
  const [nutritionData, setNutritionData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [c, w, f, n] = await Promise.all([
        api.getCycleInsights().catch(() => null),
        api.getWellnessInsights().catch(() => null),
        api.getFitnessInsights().catch(() => null),
        api.getNutritionInsights().catch(() => null),
      ]);
      setCycleData(c);
      setWellnessData(w);
      setFitnessData(f);
      setNutritionData(n);
    } catch (err: any) {
      console.error('Failed to load insights', err);
      setError(err.message || 'Could not load insights data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-56 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadInsights} />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Understanding Patterns</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">
          Your Wellness Insights
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Cycle Rhythms Insight Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-3">
            <Heart className="w-4 h-4" />
            <span>Cycle Patterns</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500">Average Cycle Length</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {cycleData?.average_length_days || 28} days
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500">Tracked Historical Cycles</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {cycleData?.tracked_cycles || 0} cycles
              </span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-slate-500">Cycle Regularity</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {cycleData?.regularity_status || 'Regular'}
              </span>
            </div>
          </div>
        </Card>

        {/* 2. Fitness Consistency Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 text-rose-500 font-bold text-sm mb-3">
            <Flame className="w-4 h-4" />
            <span>Movement Rhythm</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500">Total Workouts Completed</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {fitnessData?.total_completed_workouts || 0} sessions
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500">Total Movement Time</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {fitnessData?.total_movement_minutes || 0} mins
              </span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-slate-500">Typical Session Length</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {fitnessData?.average_session_minutes || 15} mins
              </span>
            </div>
          </div>
        </Card>

        {/* 3. Daily Wellness Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-3">
            <Smile className="w-4 h-4" />
            <span>Check-in Summary</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500">Total Check-ins Logged</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {wellnessData?.total_checkins || 0} check-ins
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {wellnessData?.wellness_note ||
                'Daily logging helps calibrate your workouts and meal plans as your cycles evolve.'}
            </p>
          </div>
        </Card>

        {/* 4. Hydration & Nutrition Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 text-sapphire-600 font-bold text-sm mb-3">
            <Droplet className="w-4 h-4" />
            <span>Hydration & Nutrition Quality</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500">Average Daily Water</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {nutritionData?.average_hydration_ml || 2000} ml
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {nutritionData?.nutrition_philosophy ||
                'Prioritize whole foods, fiber, and micronutrient coverage without calorie counting.'}
            </p>
          </div>
        </Card>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed mt-4">
        {MEDICAL_DISCLAIMER}
      </p>
    </div>
  );
};
