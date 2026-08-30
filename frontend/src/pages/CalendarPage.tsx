import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { MonthSummary, CalendarFilter, CalendarDay } from '../types';
import { MonthGrid } from '../components/calendar/MonthGrid';
import { CalendarFilterPills } from '../components/calendar/CalendarFilterPills';
import { DayDetailPanel } from '../components/calendar/DayDetailPanel';
import { PeriodLoggerModal } from '../components/cycle/PeriodLoggerModal';
import { Card } from '../components/common/Card';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  Calendar as CalendarIcon,
  Flame,
  CheckCircle2,
  Droplet,
  Sparkles,
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
    <div className="space-y-6">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Visual Rhythm History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">
            Your Monthly Story
          </h1>
        </div>

        {/* Streaks & Consistency Pill Bar */}
        {summary && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {summary.checkin_streak_days}d
              </span>
              <span className="text-slate-400">check-in</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {summary.workout_streak_days}d
              </span>
              <span className="text-slate-400">workout</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Selector Row (§10) */}
      <CalendarFilterPills
        activeFilter={activeFilter}
        onSelectFilter={(f) => setActiveFilter(f)}
      />

      {/* Supportive Streak Notification (§10) */}
      {summary?.supportive_streak_message && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50/90 to-sapphire-50/90 dark:from-slate-900 dark:to-slate-900 border border-rose-100 dark:border-slate-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{summary.supportive_streak_message}</span>
        </div>
      )}

      {isLoading && !summary ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
          <Skeleton className="h-96 rounded-3xl lg:col-span-8" />
          <Skeleton className="h-96 rounded-3xl lg:col-span-4" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadCalendar} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main 7-Column Month Grid (8 cols on desktop) */}
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

          {/* Day Detail Side Panel (4 cols on desktop) */}
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
