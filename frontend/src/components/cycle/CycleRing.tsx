import React from 'react';
import { PhaseType } from '../../types';
import { PHASE_CONFIG } from '../../constants';

interface CycleRingProps {
  currentDay: number;
  totalDays: number;
  phase: PhaseType;
  estimatedNextPeriodDays: number;
  onLogClick?: () => void;
}

export const CycleRing: React.FC<CycleRingProps> = ({
  currentDay,
  totalDays,
  phase,
  estimatedNextPeriodDays,
  onLogClick,
}) => {
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = Math.min((currentDay / (totalDays || 28)) * 100, 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const phaseConfig = PHASE_CONFIG[phase] || PHASE_CONFIG.Menstrual;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Base Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${
              phase === 'Menstrual'
                ? 'text-rose-500'
                : phase === 'Follicular'
                ? 'text-sapphire-500'
                : phase === 'Ovulatory'
                ? 'text-emerald-500'
                : 'text-amber-500'
            }`}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Cycle Day
          </span>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white my-0.5">
            {currentDay}
            <span className="text-sm font-normal text-slate-400">/{totalDays}</span>
          </span>
          <span className={`text-xs font-semibold ${phaseConfig.textColor}`}>
            {phaseConfig.name.replace(' Phase', '')}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
            Period in ~{estimatedNextPeriodDays}d
          </span>
        </div>
      </div>

      {onLogClick && (
        <button
          onClick={onLogClick}
          className="mt-3 text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 underline underline-offset-4"
        >
          Log Period Start / End
        </button>
      )}
    </div>
  );
};
