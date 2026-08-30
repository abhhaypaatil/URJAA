import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
      <button
        onClick={() => setTheme('light')}
        title="Light Mode"
        className={`p-1.5 rounded-xl transition-all ${
          theme === 'light'
            ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
        }`}
        aria-label="Switch to light theme"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        title="System Preference"
        className={`p-1.5 rounded-xl transition-all ${
          theme === 'system'
            ? 'bg-white dark:bg-slate-700 text-sapphire-600 dark:text-sapphire-400 shadow-sm'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
        }`}
        aria-label="Switch to system theme"
      >
        <Laptop className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        title="Dark Mode"
        className={`p-1.5 rounded-xl transition-all ${
          theme === 'dark'
            ? 'bg-white dark:bg-slate-700 text-rose-500 dark:text-rose-400 shadow-sm'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
        }`}
        aria-label="Switch to dark theme"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
};
