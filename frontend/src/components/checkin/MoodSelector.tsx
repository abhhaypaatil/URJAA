import React from 'react';
import { Smile, Meh, Frown, Sparkles, AlertCircle } from 'lucide-react';

interface MoodSelectorProps {
  value?: string;
  onChange: (mood: string) => void;
}

const MOODS = [
  { id: 'Great', label: 'Great', icon: Sparkles, color: 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40' },
  { id: 'Good', label: 'Good', icon: Smile, color: 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40' },
  { id: 'Okay', label: 'Okay', icon: Meh, color: 'text-sapphire-500 hover:bg-sapphire-50 dark:hover:bg-sapphire-950/40' },
  { id: 'Low', label: 'Low', icon: Frown, color: 'text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40' },
  { id: 'Bad', label: 'Bad', icon: AlertCircle, color: 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40' },
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
        How are you feeling today? (Mood)
      </label>
      <div className="grid grid-cols-5 gap-2">
        {MOODS.map((m) => {
          const Icon = m.icon;
          const isSelected = value === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                isSelected
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 shadow-sm scale-105'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 ' + m.color
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isSelected ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`} />
              <span className={`text-[11px] font-medium ${isSelected ? 'text-rose-700 dark:text-rose-300 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
                {m.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
