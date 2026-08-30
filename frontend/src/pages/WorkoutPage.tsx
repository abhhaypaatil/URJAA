import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Workout } from '../types';
import { WorkoutCard } from '../components/workout/WorkoutCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { Flame, VolumeX, Sparkles, Heart, Coffee } from 'lucide-react';
import { DURATION_OPTIONS, MEDICAL_DISCLAIMER } from '../constants';

export const WorkoutPage: React.FC = () => {
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [recommendedId, setRecommendedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<number | 'all'>('all');
  const [quietOnly, setQuietOnly] = useState<boolean>(false);
  const [isLowMotivationMode, setIsLowMotivationMode] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkouts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rec = await api.getRecommendedWorkout().catch(() => null);
      if (rec?.workout) {
        setRecommendedId(rec.workout.id);
      }

      const list = await api.getWorkouts();
      setWorkouts(list || []);
    } catch (err: any) {
      console.error('Failed to load workouts', err);
      setError(err.message || 'Could not load workout library');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const categories = ['All', 'Full body', 'Lower body', 'Upper body', 'Core', 'Mobility', 'Recovery'];

  const filteredWorkouts = workouts.filter((w) => {
    if (selectedCategory !== 'All' && w.category !== selectedCategory) return false;
    if (selectedDuration !== 'all' && w.estimated_duration_min > selectedDuration) return false;
    if (quietOnly && !w.is_quiet) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-56 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadWorkouts} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <Flame className="w-3.5 h-3.5" />
            <span>Guided Movement System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">
            Workout Library
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsLowMotivationMode(!isLowMotivationMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            isLowMotivationMode
              ? 'border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>Low-Motivation Day?</span>
        </button>
      </div>

      {/* Low Motivation Mode Banner (§8.9) */}
      {isLowMotivationMode && (
        <Card className="p-5 border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 animate-fade-in">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Not feeling a workout today? That's completely okay.
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                You don't have to push yourself. Choose a 5-minute gentle pelvic stretch, a 10-minute mindful walk, or simply take restorative rest today.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/workout/session/66666666-0000-0000-0000-000000000002')}
                >
                  5-Min Gentle Mobility Flow
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/workout/session/66666666-0000-0000-0000-000000000001')}
                >
                  Pelvic Tension Release
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filters Toolbar */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c
                  ? 'bg-slate-900 text-white dark:bg-rose-600 dark:text-white shadow-sm'
                  : 'bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Duration & Quiet Toggle Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Duration Chips */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Max Duration:</span>
            <button
              onClick={() => setSelectedDuration('all')}
              className={`px-2 py-0.5 rounded-md ${
                selectedDuration === 'all'
                  ? 'bg-slate-900 text-white dark:bg-rose-600'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All
            </button>
            {DURATION_OPTIONS.slice(0, 4).map((mins) => (
              <button
                key={mins}
                onClick={() => setSelectedDuration(mins)}
                className={`px-2 py-0.5 rounded-md ${
                  selectedDuration === mins
                    ? 'bg-slate-900 text-white dark:bg-rose-600'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                &le;{mins}m
              </button>
            ))}
          </div>

          {/* Quiet Mode Toggle */}
          <button
            type="button"
            onClick={() => setQuietOnly(!quietOnly)}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl border transition-all ${
              quietOnly
                ? 'border-sapphire-500 bg-sapphire-50 text-sapphire-700 dark:bg-sapphire-950/60 dark:text-sapphire-300 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
            }`}
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>Quiet Mode (No Jumping)</span>
          </button>
        </div>
      </div>

      {/* Workouts Grid */}
      {filteredWorkouts.length === 0 ? (
        <Card className="text-center p-8 text-xs text-slate-500">
          No workouts matching these filters. Try resetting category or duration filters.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWorkouts.map((w) => (
            <WorkoutCard
              key={w.id}
              workout={w}
              isRecommended={w.id === recommendedId}
              onStart={() => navigate(`/workout/session/${w.id}`)}
            />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed mt-4">
        {MEDICAL_DISCLAIMER}
      </p>
    </div>
  );
};
