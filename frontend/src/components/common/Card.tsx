import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'outline' | 'rose' | 'sapphire' | 'sage' | 'gradient';
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
      'bg-white text-slate-800 shadow-soft border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100',
    flat:
      'bg-slate-50/80 text-slate-800 border border-slate-200/60 dark:bg-slate-900/50 dark:border-slate-800/60 dark:text-slate-100',
    outline:
      'bg-transparent border border-slate-200 text-slate-800 dark:border-slate-800 dark:text-slate-100',
    rose:
      'bg-rose-50/70 border border-rose-100 text-slate-900 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-100',
    sapphire:
      'bg-sapphire-50/70 border border-sapphire-100 text-slate-900 dark:bg-sapphire-950/20 dark:border-sapphire-900/40 dark:text-sapphire-100',
    sage:
      'bg-sage-50/70 border border-sage-100 text-slate-900 dark:bg-sage-950/20 dark:border-sage-900/40 dark:text-sage-100',
    gradient:
      'bg-gradient-to-br from-white via-rose-50/30 to-slate-50 border border-rose-100/60 shadow-soft dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/20 dark:border-slate-800',
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
