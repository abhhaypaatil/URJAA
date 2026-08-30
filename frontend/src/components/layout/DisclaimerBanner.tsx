import React from 'react';
import { Info } from 'lucide-react';
import { MEDICAL_DISCLAIMER } from '../../constants';

export const DisclaimerBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`flex items-start gap-2.5 p-3 rounded-2xl bg-warm-100/70 dark:bg-slate-900/60 border border-warm-200/50 dark:border-slate-800 text-[12px] text-slate-600 dark:text-slate-400 ${className}`}
    >
      <Info className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
      <span className="leading-relaxed">{MEDICAL_DISCLAIMER}</span>
    </div>
  );
};
