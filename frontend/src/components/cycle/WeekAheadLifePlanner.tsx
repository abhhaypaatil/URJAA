import React from 'react';
import { PhaseType } from '../../types';
import { PHASE_CONFIG, CYCLE_SYNC_GUIDE } from '../../constants';
import { Calendar, Briefcase, Flame, Sparkles, ArrowRight, Zap } from 'lucide-react';

interface WeekAheadLifePlannerProps {
  currentCycleDay: number;
  avgCycleLength?: number;
}

export const WeekAheadLifePlanner: React.FC<WeekAheadLifePlannerProps> = ({
  currentCycleDay,
  avgCycleLength = 29,
}) => {
  // Generate next 7 days with phase forecasting
  const days = Array.from({ length: 7 }).map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() + index);

    // Calculate cycle day for this date
    let dayInCycle = (currentCycleDay + index - 1) % avgCycleLength + 1;

    // Estimate phase
    let phase: PhaseType = 'Follicular';
    if (dayInCycle <= 5) {
      phase = 'Menstrual';
    } else if (dayInCycle <= 13) {
      phase = 'Follicular';
    } else if (dayInCycle <= 16) {
      phase = 'Ovulatory';
    } else {
      phase = 'Luteal';
    }

    const guide = CYCLE_SYNC_GUIDE[phase];
    const isToday = index === 0;

    return {
      date: d,
      dateString: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayOfMonth: d.getDate(),
      cycleDay: dayInCycle,
      phase,
      guide,
      isToday,
    };
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sapphire-600 dark:text-sapphire-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
              7-Day Life & Career Planner
            </span>
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mt-0.5">
            Sync Your Upcoming Week
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Plan meetings, workouts, and social events around your upcoming biology
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
        {days.map((item, i) => {
          const config = PHASE_CONFIG[item.phase];
          return (
            <div
              key={i}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                item.isToday
                  ? 'border-rose-400 bg-rose-50/60 dark:bg-rose-950/30 dark:border-rose-800 shadow-sm ring-1 ring-rose-200 dark:ring-rose-900'
                  : 'border-slate-100 dark:border-slate-800 bg-warm-50/40 dark:bg-slate-800/40 hover:border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className={`font-bold ${item.isToday ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {item.weekday} {item.dayOfMonth}
                  </span>
                  {item.isToday && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-600 text-white">
                      Today
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.badgeBg} ${config.badgeText} inline-block`}>
                    Day {item.cycleDay} &bull; {item.phase.slice(0, 4)}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="flex items-start gap-1">
                    <Briefcase className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-tight">
                      {item.phase === 'Menstrual'
                        ? 'Strategic review & solo focus'
                        : item.phase === 'Follicular'
                        ? 'Brainstorm & pitch new ideas'
                        : item.phase === 'Ovulatory'
                        ? 'High-stakes talks & leadership'
                        : 'Organize, edit & finalize tasks'}
                    </span>
                  </div>

                  <div className="flex items-start gap-1 pt-1 border-t border-slate-100 dark:border-slate-700/50">
                    <Flame className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1 leading-tight font-medium">
                      {item.phase === 'Menstrual'
                        ? 'Restorative walk'
                        : item.phase === 'Follicular'
                        ? 'Progressive strength'
                        : item.phase === 'Ovulatory'
                        ? 'Peak athletic power'
                        : 'Pilates sculpting'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-2.5 pt-1.5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                <span>Energy:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {item.guide.socialEnergy.split('&')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
