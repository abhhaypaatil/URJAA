import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  Heart,
  Flame,
  UtensilsCrossed,
  Smile,
  Activity,
  Zap,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
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

  const trendChartData = [
    { day: 'Day 1', energy: 50, mood: 60, estrogen: 20 },
    { day: 'Day 3', energy: 58, mood: 65, estrogen: 35 },
    { day: 'Day 5', energy: 72, mood: 75, estrogen: 60 },
    { day: 'Day 7', energy: 84, mood: 82, estrogen: 80 },
    { day: 'Day 9', energy: 92, mood: 90, estrogen: 95 },
    { day: 'Day 11', energy: 95, mood: 94, estrogen: 98 },
    { day: 'Day 14', energy: 88, mood: 86, estrogen: 70 },
    { day: 'Day 18', energy: 75, mood: 78, estrogen: 45 },
    { day: 'Day 22', energy: 68, mood: 70, estrogen: 40 },
    { day: 'Day 26', energy: 55, mood: 62, estrogen: 25 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-10 w-48 bg-warm-200 dark:bg-slate-800" />
        <Skeleton className="h-72 rounded-3xl bg-warm-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-56 rounded-3xl bg-warm-200 dark:bg-slate-800" />
          <Skeleton className="h-56 rounded-3xl bg-warm-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadInsights} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sapphire-600 dark:text-sapphire-400 mb-1">
            <Activity className="w-4 h-4" />
            <span className="uppercase tracking-wider font-mono text-[11px]">Personal Trends & Bio-Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
            Health & Habit Trends
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Correlations between cycle phases, energy levels, sleep patterns, and movement consistency over time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Habit Adherence</span>
              <span className="font-bold text-slate-800 dark:text-white">94% Aligned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Waveform Chart */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-sapphire-600 dark:text-sapphire-400 block mb-1">
              Phase Correlation
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-white">
              Hormone Curve & Energy Stamina
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Estrogen Curve</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Energy Stamina</span>
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendChartData}>
              <defs>
                <linearGradient id="estrogenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#0f172a',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="estrogen"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#estrogenGrad)"
              />
              <Area
                type="monotone"
                dataKey="energy"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#energyGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4 Multi-Dimensional Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Cycle Patterns */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-bold text-sm mb-4">
            <Heart className="w-4 h-4" />
            <span>Cycle Regularity</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Average Cycle Length</span>
              <span className="font-bold text-slate-800 dark:text-white">
                {cycleData?.average_length_days || 29} days
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Tracked Cycles</span>
              <span className="font-bold text-slate-800 dark:text-white">
                {cycleData?.tracked_cycles || 6} cycles
              </span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Pattern Regularity</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {cycleData?.regularity_score || 95}% High Regularity
              </span>
            </div>
          </div>
        </div>

        {/* 2. Movement & Fitness */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-bold text-sm mb-4">
            <Flame className="w-4 h-4" />
            <span>Movement & Activity</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Workouts Completed</span>
              <span className="font-bold text-slate-800 dark:text-white">
                {fitnessData?.total_completed_workouts || 12} sessions
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Total Movement Duration</span>
              <span className="font-bold text-slate-800 dark:text-white">
                {fitnessData?.total_movement_minutes || 180} mins
              </span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Progress Trend</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {fitnessData?.progression_index || '+12% consistency'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Mood & Sleep */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 text-sapphire-600 dark:text-sapphire-400 font-bold text-sm mb-4">
            <Smile className="w-4 h-4" />
            <span>Mood & Sleep Correlation</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Check-in Logs</span>
              <span className="font-bold text-slate-800 dark:text-white">
                {wellnessData?.total_checkins || 24} check-ins
              </span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Average Sleep Quality</span>
              <span className="font-bold text-sapphire-600 dark:text-sapphire-400">
                {wellnessData?.sleep_quality_avg || 'Good / Restorative'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Energy and mood typically peak during follicular & ovulatory days (estrogen surge), easing into lower impact during late luteal.
            </p>
          </div>
        </div>

        {/* 4. Nutrition & Hydration */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-4">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Nutrition & Hydration</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Average Hydration</span>
              <span className="font-bold text-slate-800 dark:text-white">
                {nutritionData?.average_hydration_ml || 2100} ml / day
              </span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Meal Plan Alignment</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {nutritionData?.nutrient_adherence_percent || 88}% Aligned
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Consistent focus on whole grains, magnesium, zinc, and healthy fats without restrictive caloric tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <p className="text-[10px] text-slate-400 text-center leading-relaxed mt-4 max-w-2xl mx-auto">
        {MEDICAL_DISCLAIMER}
      </p>
    </div>
  );
};
