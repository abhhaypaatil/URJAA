import React from 'react';
import { Battery, BatteryCharging, BatteryMedium } from 'lucide-react';

interface EnergySelectorProps {
  value?: string;
  onChange: (energy: string) => void;
}

const ENERGIES = [
  { id: 'High', label: 'High Energy', sub: 'Ready to move & create', icon: BatteryCharging, color: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
  { id: 'Medium', label: 'Moderate Energy', sub: 'Steady & balanced', icon: BatteryMedium, color: 'border-sapphire-200 bg-sapphire-50 text-sapphire-700 dark:bg-sapphire-950/40 dark:text-sapphire-300' },
  { id: 'Low', label: 'Low Energy', sub: 'Honoring recovery & rest', icon: Battery, color: 'border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' },
];

export const EnergySelector: React.FC<EnergySelectorProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
        Energy Level
      </label>
      <div className="grid grid-cols-3 gap-2">
        {ENERGIES.map((e) => {
          const Icon = e.icon;
          const isSelected = value === e.id;
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => onChange(e.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm dark:border-rose-500 dark:bg-rose-600 dark:text-white'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Icon className="w-5 h-5 mb-1 shrink-0" />
              <span className="text-xs font-semibold leading-tight">{e.label}</span>
              <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300 dark:text-rose-100' : 'text-slate-400 dark:text-slate-500'}`}>
                {e.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
