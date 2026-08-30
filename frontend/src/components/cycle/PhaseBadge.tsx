import React from 'react';
import { Sparkles } from 'lucide-react';
import { PhaseType, ConfidenceLevel } from '../../types';
import { PHASE_CONFIG } from '../../constants';

interface PhaseBadgeProps {
  phase: PhaseType;
  confidenceLabel?: string;
  confidenceLevel?: ConfidenceLevel;
  showIcon?: boolean;
}

export const PhaseBadge: React.FC<PhaseBadgeProps> = ({
  phase,
  confidenceLabel,
  showIcon = true,
}) => {
  const config = PHASE_CONFIG[phase] || PHASE_CONFIG.Menstrual;

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${config.badgeBg} ${config.badgeText}`}
      >
        {showIcon && <Sparkles className="w-3.5 h-3.5" />}
        <span>{config.name}</span>
      </span>
      {confidenceLabel && (
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full">
          {confidenceLabel}
        </span>
      )}
    </div>
  );
};
