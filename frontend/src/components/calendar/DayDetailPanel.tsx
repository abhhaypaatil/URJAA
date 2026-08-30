import React from 'react';
import { CalendarDay, DailyCheckin, WorkoutSession } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { PhaseBadge } from '../cycle/PhaseBadge';
import {
  Calendar as CalendarIcon,
  Heart,
  Flame,
  UtensilsCrossed,
  Droplet,
  Moon,
  Smile,
  Plus,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DayDetailPanelProps {
  day?: CalendarDay | null;
  checkin?: DailyCheckin | null;
  workouts?: WorkoutSession[];
  onClose: () => void;
  onOpenPeriodLogger: () => void;
}

export const DayDetailPanel: React.FC<DayDetailPanelProps> = ({
  day,
  checkin,
  workouts = [],
  onClose,
  onOpenPeriodLogger,
}) => {
  const navigate = useNavigate();

  if (!day) return null;

  const formattedDate = new Date(`${day.date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 border border-slate-100 dark:border-slate-800 shadow-soft h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Day Overview
              </span>
              {day.is_future && (
                <Badge size="sm" variant="amber">
                  Estimated Plan
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {formattedDate}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phase & Cycle Banner */}
        <div className="p-3.5 rounded-2xl bg-warm-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Cycle Day {day.cycle_day}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {day.is_future ? 'Estimated ' : ''}{day.estimated_phase} Phase
              </p>
            </div>
          </div>
          <PhaseBadge phase={day.estimated_phase} showIcon={false} />
        </div>

        {/* Dimension Logs Breakdown */}
        <div className="space-y-3">
          {/* Workout Dimension */}
          <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-warm-50/40 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Workout</span>
              </div>
              <Badge
                size="sm"
                variant={
                  day.workout_status === 'COMPLETED'
                    ? 'rose'
                    : day.workout_status === 'SKIPPED'
                    ? 'amber'
                    : 'neutral'
                }
              >
                {day.workout_status}
              </Badge>
            </div>
            {day.workout_title && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
                {day.workout_title} {day.workout_minutes ? `(${day.workout_minutes} mins)` : ''}
              </p>
            )}
          </div>

          {/* Nutrition Dimension */}
          <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-warm-50/40 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <UtensilsCrossed className="w-4 h-4 text-sage-600" />
                <span>Nutrition Plan</span>
              </div>
              <Badge
                size="sm"
                variant={day.nutrition_status === 'Followed' ? 'sage' : 'neutral'}
              >
                {day.nutrition_status}
              </Badge>
            </div>
            {day.meals_completed > 0 && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5">
                {day.meals_completed} of 4 meals marked complete
              </p>
            )}
          </div>

          {/* Hydration Dimension */}
          <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-warm-50/40 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Droplet className="w-4 h-4 text-sapphire-500" />
                <span>Hydration</span>
              </div>
              <span className="text-xs font-bold text-sapphire-600 dark:text-sapphire-400">
                {day.water_ml}ml / {day.water_target_ml}ml
              </span>
            </div>
          </div>

          {/* Mood & Symptoms */}
          {day.checkin_completed && (
            <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-warm-50/40 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                <Smile className="w-4 h-4 text-amber-500" />
                <span>Check-in Log</span>
              </div>
              <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
                {day.mood && <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md">Mood: {day.mood}</span>}
                {day.energy && <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md">Energy: {day.energy}</span>}
                {day.sleep && <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md">Sleep: {day.sleep}</span>}
                {day.cramps && <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md">Cramps: {day.cramps}</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Buttons for Non-Logged / Non-Future Days (§10) */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => navigate('/check-in')}
        >
          {day.checkin_completed ? 'Edit Today\'s Check-in' : 'Log Daily Check-in'}
        </Button>

        <Button
          variant="soft"
          size="sm"
          className="w-full justify-start text-xs"
          leftIcon={<Heart className="w-3.5 h-3.5" />}
          onClick={onOpenPeriodLogger}
        >
          Log Period Start / End
        </Button>
      </div>
    </div>
  );
};
