import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'rose' | 'blush' | 'pistachio' | 'plum' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-2xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5 font-semibold',
    icon: 'p-2.5 rounded-2xl',
  };

  const variantStyles = {
    primary:
      'bg-plum-950 text-white hover:bg-plum-900 focus:ring-plum-800 shadow-sm dark:bg-rose-600 dark:hover:bg-rose-500 dark:focus:ring-rose-500',
    rose:
      'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm shadow-rose-200 dark:shadow-none',
    blush:
      'bg-blush-500 text-white hover:bg-blush-600 focus:ring-blush-400 shadow-sm shadow-blush-200 dark:shadow-none',
    pistachio:
      'bg-pistachio-600 text-white hover:bg-pistachio-700 focus:ring-pistachio-500 shadow-sm shadow-pistachio-200 dark:shadow-none',
    plum:
      'bg-plum-900 text-ivory-50 hover:bg-plum-950 focus:ring-plum-700 shadow-sm',
    secondary:
      'bg-skyblue-600 text-white hover:bg-skyblue-700 focus:ring-skyblue-500 shadow-sm shadow-skyblue-200 dark:shadow-none',
    soft:
      'bg-blush-100/80 text-plum-900 hover:bg-blush-200/80 focus:ring-blush-300 dark:bg-rose-950/60 dark:text-rose-200 dark:hover:bg-rose-900/60',
    outline:
      'border border-plum-200/80 bg-white text-plum-900 hover:bg-ivory-50 focus:ring-plum-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
    ghost:
      'text-plum-700 hover:bg-blush-50 hover:text-plum-950 focus:ring-plum-300 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
