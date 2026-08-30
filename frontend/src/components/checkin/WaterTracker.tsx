import React from 'react';
import { Droplet, Plus } from 'lucide-react';
import { ProgressRing } from '../common/ProgressRing';

interface WaterTrackerProps {
  waterML: number;
  targetML?: number;
  onAddWater: (amountML: number) => void;
  onSetWater: (totalML: number) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  waterML,
  targetML = 2000,
  onAddWater,
  onSetWater,
}) => {
  const percentage = Math.min(Math.round((waterML / targetML) * 100), 100);
  const liters = (waterML / 1000).toFixed(1);
  const targetLiters = (targetML / 1000).toFixed(1);

  const quickButtons = [
    { label: '+250ml', amount: 250 },
    { label: '+500ml', amount: 500 },
    { label: '+750ml', amount: 750 },
    { label: '+1.0 L', amount: 1000 },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-1">
      {/* Visual Ring */}
      <div className="flex items-center gap-4">
        <ProgressRing progress={percentage} size={110} strokeWidth={8} colorClass="text-sapphire-500">
          <Droplet className="w-5 h-5 text-sapphire-500 mb-0.5 fill-sapphire-500/20" />
          <span className="text-base font-bold text-slate-800 dark:text-white leading-none">
            {liters} <span className="text-xs font-normal text-slate-400">/ {targetLiters}L</span>
          </span>
          <span className="text-[10px] font-medium text-slate-400 mt-0.5">{percentage}% Goal</span>
        </ProgressRing>

        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Daily Hydration</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-[160px]">
            Adequate water flushes excess fluid and reduces luteal bloating.
          </span>
          <div className="mt-2 flex items-center gap-1.5">
            <input
              type="number"
              step="50"
              min="0"
              max="5000"
              value={waterML || ''}
              onChange={(e) => onSetWater(parseInt(e.target.value, 10) || 0)}
              placeholder="ml"
              className="w-20 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
            />
            <span className="text-xs text-slate-400">ml</span>
          </div>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
        {quickButtons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={() => onAddWater(btn.amount)}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-sapphire-50 hover:bg-sapphire-100 dark:bg-sapphire-950/50 dark:hover:bg-sapphire-900/60 border border-sapphire-100 dark:border-sapphire-900/50 text-sapphire-700 dark:text-sapphire-300 text-xs font-semibold transition-all active:scale-95"
          >
            <Plus className="w-3 h-3" />
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};
