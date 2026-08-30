import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'rose' | 'sapphire' | 'sage' | 'amber' | 'neutral' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full shrink-0 select-none';

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const variantStyles = {
    rose: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200',
    sapphire: 'bg-sapphire-100 text-sapphire-800 dark:bg-sapphire-950/60 dark:text-sapphire-200',
    sage: 'bg-sage-100 text-sage-800 dark:bg-sage-950/60 dark:text-sage-200',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    outline: 'border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300',
  };

  const dotColors = {
    rose: 'bg-rose-500',
    sapphire: 'bg-sapphire-500',
    sage: 'bg-sage-500',
    amber: 'bg-amber-500',
    neutral: 'bg-slate-400',
    outline: 'bg-slate-400',
  };

  return (
    <span className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))} {...props}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
