import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { MonthSummary, CalendarFilter, CalendarDay } from '../types';
import { MonthGrid } from '../components/calendar/MonthGrid';
import { CalendarFilterPills } from '../components/calendar/CalendarFilterPills';
import { DayDetailPanel } from '../components/calendar/DayDetailPanel';
import { PeriodLoggerModal } from '../components/cycle/PeriodLoggerModal';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  Calendar as CalendarIcon,
  Flame,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  );
  const [activeFilter, setActiveFilter] = useState<CalendarFilter>('all');
  const [summary, setSummary] = useState<MonthSummary | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0] // YYYY-MM-DD
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggerOpen, setIsLoggerOpen] = useState<boolean>(false);

  const loadCalendar = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getMonthCalendar(currentMonth, activeFilter);
      setSummary(data);
    } catch (err: any) {
      console.error('Failed to load month calendar', err);
      setError(err.message || 'Could not load calendar data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, [currentMonth, activeFilter]);

  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1);
    const yStr = prevDate.getFullYear();
    const mStr = String(prevDate.getMonth() + 1).padStart(2, '0');
    setCurrentMonth(`${yStr}-${mStr}`);
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const nextDate = new Date(year, month, 1);
    const yStr = nextDate.getFullYear();
    const mStr = String(nextDate.getMonth() + 1).padStart(2, '0');
    setCurrentMonth(`${yStr}-${mStr}`);
  };

  const handleToday = () => {
    const today = new Date();
    const yStr = today.getFullYear();
    const mStr = String(today.getMonth() + 1).padStart(2, '0');
    setCurrentMonth(`${yStr}-${mStr}`);
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  const selectedDayObj = summary?.days.find((d) => d.date === selectedDate) || summary?.days[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <CalendarIcon className="w-4 h-4 text-sapphire-600 dark:text-sapphire-400" />
            <span className="uppercase tracking-wider font-mono text-[11px]">Monthly Rhythm & Consistency</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
            Habit & Cycle Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            A unified view of your workouts, nutrition, cycle days, and wellness check-ins across the month.
          </p>
        </div>

        {/* Streaks & Consistency Pill Bar */}
        {summary && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="font-bold text-slate-800 dark:text-white block">{summary.checkin_streak_days}d</span>
                <span className="text-[10px] text-slate-400">check-in</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
              <Flame className="w-4 h-4 text-rose-500" />
              <div>
                <span className="font-bold text-slate-800 dark:text-white block">{summary.workout_streak_days}d</span>
                <span className="text-[10px] text-slate-400">workout</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
              <Zap className="w-4 h-4 text-amber-500" />
              <div>
                <span className="font-bold text-slate-800 dark:text-white block">{summary.overall_consistency_score}%</span>
                <span className="text-[10px] text-slate-400">harmony</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Selector Row */}
      <CalendarFilterPills
        activeFilter={activeFilter}
        onSelectFilter={(f) => setActiveFilter(f)}
      />

      {/* Supportive Streak Notification Banner */}
      {summary?.supportive_streak_message && (
        <div className="p-4 rounded-2xl bg-warm-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>{summary.supportive_streak_message}</span>
        </div>
      )}

      {isLoading && !summary ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
          <Skeleton className="h-96 rounded-3xl lg:col-span-8 bg-warm-200 dark:bg-slate-800" />
          <Skeleton className="h-96 rounded-3xl lg:col-span-4 bg-warm-200 dark:bg-slate-800" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadCalendar} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main 7-Column Month Grid */}
          <div className="lg:col-span-8">
            <MonthGrid
              currentMonth={currentMonth}
              days={summary?.days || []}
              activeFilter={activeFilter}
              selectedDate={selectedDate}
              onSelectDate={(date) => setSelectedDate(date)}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
            />
          </div>

          {/* Day Detail Side Panel */}
          <div className="lg:col-span-4 sticky top-20">
            <DayDetailPanel
              day={selectedDayObj}
              onClose={() => {}}
              onOpenPeriodLogger={() => setIsLoggerOpen(true)}
            />
          </div>
        </div>
      )}

      <PeriodLoggerModal
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        onSuccess={loadCalendar}
      />
    </div>
  );
};
