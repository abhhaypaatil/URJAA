import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'outline' | 'rose' | 'blush' | 'pistachio' | 'skyblue' | 'plum' | 'sapphire' | 'sage' | 'gradient';
  isHoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  isHoverable = false,
  ...props
}) => {
  const baseStyles = 'rounded-3xl p-5 md:p-6 transition-all duration-200';

  const variantStyles = {
    default:
      'bg-white text-plum-950 shadow-soft border border-plum-100/70 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100',
    flat:
      'bg-ivory-100/70 text-plum-950 border border-plum-100/60 dark:bg-slate-900/50 dark:border-slate-800/60 dark:text-slate-100',
    outline:
      'bg-transparent border border-plum-200/80 text-plum-950 dark:border-slate-800 dark:text-slate-100',
    blush:
      'bg-blush-50/70 border border-blush-200/70 text-plum-950 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-100',
    rose:
      'bg-rose-50/70 border border-rose-200/70 text-plum-950 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-100',
    pistachio:
      'bg-pistachio-50/70 border border-pistachio-200/70 text-plum-950 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-100',
    skyblue:
      'bg-skyblue-50/70 border border-skyblue-200/70 text-plum-950 dark:bg-sky-950/20 dark:border-sky-900/40 dark:text-sky-100',
    plum:
      'bg-plum-900 text-ivory-50 border border-plum-800 shadow-soft dark:bg-plum-950 dark:border-plum-900',
    sapphire:
      'bg-sapphire-50/70 border border-sapphire-100 text-slate-900 dark:bg-sapphire-950/20 dark:border-sapphire-900/40 dark:text-sapphire-100',
    sage:
      'bg-sage-50/70 border border-sage-100 text-slate-900 dark:bg-sage-950/20 dark:border-sage-900/40 dark:text-sage-100',
    gradient:
      'bg-gradient-to-br from-white via-blush-50/30 to-ivory-50 border border-blush-100/60 shadow-soft dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/20 dark:border-slate-800',
  };

  const hoverStyles = isHoverable
    ? 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer'
    : '';

  return (
    <div className={twMerge(clsx(baseStyles, variantStyles[variant], hoverStyles, className))} {...props}>
      {children}
    </div>
  );
};
