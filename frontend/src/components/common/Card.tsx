import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'outline' | 'rose' | 'sapphire' | 'gradient';
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
      'bg-white text-slate-800 shadow-soft border border-slate-100/80 dark:bg-slate-900/90 dark:border-slate-800/80 dark:text-slate-100',
    flat:
      'bg-warm-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100',
    outline:
      'bg-transparent border border-slate-200 text-slate-800 dark:border-slate-800 dark:text-slate-100',
    rose:
      'bg-rose-50/80 border border-rose-100 text-slate-900 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-100',
    sapphire:
      'bg-sapphire-50/80 border border-sapphire-100 text-slate-900 dark:bg-sapphire-950/40 dark:border-sapphire-900/50 dark:text-sapphire-100',
    gradient:
      'bg-gradient-to-br from-rose-50/90 via-warm-50 to-sapphire-50/80 border border-rose-100/50 shadow-soft dark:from-slate-900 dark:via-rose-950/20 dark:to-sapphire-950/20 dark:border-slate-800',
  };

  const hoverStyles = isHoverable
    ? 'hover:shadow-soft-lg hover:-translate-y-0.5 cursor-pointer'
    : '';

  return (
    <div className={twMerge(clsx(baseStyles, variantStyles[variant], hoverStyles, className))} {...props}>
      {children}
    </div>
  );
};
