import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  progress: number; // 0 to 100
  colorClass?: string;
  height?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  colorClass = 'bg-rose-500',
  height = 'h-2',
  className,
}) => {
  const clamped = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={clsx('w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden', height, className)}>
      <div
        className={clsx('h-full transition-all duration-500 ease-out rounded-full', colorClass)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};
