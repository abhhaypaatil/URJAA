import React from 'react';
import { CalendarFilter } from '../../types';

interface CalendarFilterPillsProps {
  activeFilter: CalendarFilter;
  onSelectFilter: (filter: CalendarFilter) => void;
}

const FILTERS: Array<{ id: CalendarFilter; label: string }> = [
  { id: 'all', label: 'All History' },
  { id: 'cycle', label: 'Cycle & Period' },
  { id: 'exercise', label: 'Workouts' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'hydration', label: 'Hydration' },
  { id: 'mood', label: 'Mood' },
  { id: 'energy', label: 'Energy' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'consistency', label: 'Consistency' },
];

export const CalendarFilterPills: React.FC<CalendarFilterPillsProps> = ({
  activeFilter,
  onSelectFilter,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 px-1">
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelectFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none ${
              isActive
                ? 'bg-slate-900 text-white dark:bg-rose-600 dark:text-white shadow-sm'
                : 'bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
};
