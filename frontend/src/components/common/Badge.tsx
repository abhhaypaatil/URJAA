import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'rose' | 'blush' | 'pistachio' | 'skyblue' | 'plum' | 'sapphire' | 'sage' | 'amber' | 'neutral' | 'outline';
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
    blush: 'bg-blush-100 text-plum-900 dark:bg-rose-950/60 dark:text-rose-200',
    rose: 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200',
    pistachio: 'bg-pistachio-100 text-pistachio-900 dark:bg-emerald-950/60 dark:text-emerald-200',
    skyblue: 'bg-skyblue-100 text-skyblue-900 dark:bg-sky-950/60 dark:text-sky-200',
    plum: 'bg-plum-100 text-plum-950 dark:bg-plum-950/80 dark:text-plum-200',
    sapphire: 'bg-sapphire-100 text-sapphire-800 dark:bg-sapphire-950/60 dark:text-sapphire-200',
    sage: 'bg-sage-100 text-sage-800 dark:bg-sage-950/60 dark:text-sage-200',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200',
    neutral: 'bg-ivory-200/80 text-plum-800 dark:bg-slate-800 dark:text-slate-300',
    outline: 'border border-plum-200/80 text-plum-800 dark:border-slate-700 dark:text-slate-300',
  };

  const dotColors = {
    blush: 'bg-blush-500',
    rose: 'bg-rose-500',
    pistachio: 'bg-pistachio-500',
    skyblue: 'bg-skyblue-500',
    plum: 'bg-plum-700',
    sapphire: 'bg-sapphire-500',
    sage: 'bg-sage-500',
    amber: 'bg-amber-500',
    neutral: 'bg-plum-400',
    outline: 'bg-plum-400',
  };

  return (
    <span className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))} {...props}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
