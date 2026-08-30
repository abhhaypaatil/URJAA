import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Calendar as CalendarIcon,
  Flame,
  UtensilsCrossed,
  Sparkles,
  BarChart3,
  User,
  Heart,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/cycle', label: 'Cycle', icon: Heart },
    { to: '/workout', label: 'Workout', icon: Flame },
    { to: '/nutrition', label: 'Nutrition', icon: UtensilsCrossed },
    { to: '/calendar', label: 'Calendar', icon: CalendarIcon },
    { to: '/insights', label: 'Insights', icon: BarChart3 },
  ];

  return (
    <>
      {/* Desktop Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <NavLink to="/home" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-semibold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                Urjaa
              </span>
              <span className="text-[10px] uppercase font-medium tracking-widest text-rose-600 dark:text-rose-400">
                Wellness
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-2xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle + Profile */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `p-2 rounded-2xl border transition-all ${
                    isActive
                      ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-800 dark:bg-rose-950/60'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900'
                  }`
                }
                title="Profile & Settings"
              >
                <User className="w-4 h-4" />
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-rose-600"
              >
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 safe-area-pb">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl text-[10px] font-medium transition-all ${
                    isActive
                      ? 'text-rose-600 dark:text-rose-400 font-semibold scale-105'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};
