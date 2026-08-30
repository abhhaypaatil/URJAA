import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Droplet, Flame, UtensilsCrossed } from 'lucide-react';
import { CalendarDay, CalendarFilter } from '../../types';

interface MonthGridProps {
  currentMonth: string; // YYYY-MM
  days: CalendarDay[];
  activeFilter: CalendarFilter;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export const MonthGrid: React.FC<MonthGridProps> = ({
  currentMonth,
  days,
  activeFilter,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}) => {
  const monthDate = new Date(`${currentMonth}-01T00:00:00`);
  const monthTitle = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Calculate day-of-week offset for first day of month (0 = Sun, 1 = Mon, etc.)
  const firstDayWeekday = monthDate.getDay();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 border border-slate-100 dark:border-slate-800 shadow-soft">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg md:text-xl font-serif font-bold text-slate-900 dark:text-white">
          {monthTitle}
        </h3>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={onPrevMonth}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Column Headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDays.map((wd) => (
          <div key={wd} className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Leading Empty Cells */}
        {Array.from({ length: firstDayWeekday }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[64px] md:min-h-[82px] rounded-2xl bg-transparent" />
        ))}

        {/* Days in Month */}
        {days.map((d) => {
          const isSelected = d.date === selectedDate;
          const isToday = d.is_today;

          // Build accessible aria label (§13)
          const ariaLabel = `${monthDate.toLocaleDateString('en-US', { month: 'long' })} ${d.day_of_month}, cycle day ${d.cycle_day}, estimated ${d.estimated_phase} phase, workout ${d.workout_status.toLowerCase()}, nutrition ${d.nutrition_status.toLowerCase()}`;

          return (
            <button
              key={d.date}
              type="button"
              onClick={() => onSelectDate(d.date)}
              aria-label={ariaLabel}
              className={`relative min-h-[64px] md:min-h-[82px] p-1.5 md:p-2 rounded-2xl border transition-all flex flex-col justify-between text-left group ${
                isSelected
                  ? 'border-slate-900 bg-slate-900/5 dark:border-rose-500 dark:bg-rose-950/20 shadow-sm'
                  : isToday
                  ? 'border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/10'
                  : d.is_period
                  ? 'border-rose-200/80 bg-rose-50/50 dark:border-rose-900/30 dark:bg-rose-950/20'
                  : d.is_estimated_period
                  ? 'border-dashed border-rose-200 bg-rose-50/20 dark:border-rose-900/30'
                  : 'border-slate-100 dark:border-slate-800/80 bg-warm-50/40 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Day Header: Number + Period Badge */}
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-bold ${
                    isToday
                      ? 'w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center'
                      : isSelected
                      ? 'text-slate-900 dark:text-rose-400 font-extrabold'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {d.day_of_month}
                </span>

                {/* Cycle Indicator */}
                {d.is_period && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm" title="Period Day" />
                )}
                {d.is_estimated_period && (
                  <span className="w-2 h-2 rounded-full border border-rose-400 border-dashed" title="Estimated Period" />
                )}
              </div>

              {/* Day Middle: Filter-Specific & Multi-Indicators */}
              <div className="flex flex-wrap items-center gap-1 my-1">
                {/* Workout Indicator */}
                {d.workout_status === 'COMPLETED' && (
                  <span className="p-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400" title="Workout Completed">
                    <Flame className="w-3 h-3" />
                  </span>
                )}
                {d.workout_status === 'SKIPPED' && (
                  <span className="p-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-600" title="Workout Skipped">
                    <Flame className="w-3 h-3 opacity-40" />
                  </span>
                )}

                {/* Nutrition Indicator */}
                {d.nutrition_status === 'Followed' && (
                  <span className="p-0.5 rounded-md bg-sage-100 dark:bg-sage-950 text-sage-600" title="Nutrition Followed">
                    <UtensilsCrossed className="w-3 h-3" />
                  </span>
                )}

                {/* Hydration Indicator */}
                {d.water_percentage >= 80 && (
                  <span className="p-0.5 rounded-md bg-sapphire-100 dark:bg-sapphire-950 text-sapphire-600" title="Hydration Target Met">
                    <Droplet className="w-3 h-3" />
                  </span>
                )}
              </div>

              {/* Day Footer: Consistency or Phase Note */}
              <div className="flex items-center justify-between w-full text-[9px] text-slate-400 dark:text-slate-500">
                <span>D{d.cycle_day}</span>
                {d.consistency_score > 0 && !d.is_future && (
                  <span className="font-semibold text-slate-600 dark:text-slate-400">{d.consistency_score}%</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
