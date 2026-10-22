import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Heart,
  Flame,
  UtensilsCrossed,
  Activity,
  Calendar as CalendarIcon,
  BarChart3,
  User,
  Home,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useAvatar } from '../../context/AvatarContext';

interface NavbarProps {
  onOpenCompanion?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCompanion }) => {
  const { user, profile } = useAuth();
  const { avatar } = useAvatar();

  const navItems = [
    { to: '/home', label: 'Today', icon: Home },
    { to: '/cycle', label: 'Cycle', icon: Heart },
    { to: '/workout', label: 'Movement', icon: Flame },
    { to: '/nutrition', label: 'Nutrition', icon: UtensilsCrossed },
    { to: '/check-in', label: 'Check-in', icon: Activity },
    { to: '/calendar', label: 'Calendar', icon: CalendarIcon },
    { to: '/insights', label: 'Insights', icon: BarChart3 },
  ];

  return (
    <>
      {/* Desktop Top Lifestyle Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <NavLink to="/home" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                Urjaa
              </span>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold tracking-wider uppercase mt-0.5">
                Cycle-Aware Wellness
              </span>
            </div>
          </NavLink>

          {/* Feature Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-subtle'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* AI Assistant button */}
            <button
              onClick={onOpenCompanion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100/80 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-xs font-semibold text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60 transition-all active:scale-95"
              title="Open Aura Wellness Assistant"
            >
              <MessageCircle className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Ask Aura</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Pill */}
            {user ? (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-2xl border transition-all ${
                    isActive
                      ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`
                }
                title="Profile & Settings"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {avatar.generatedAvatarUrl || avatar.sourceImage ? (
                    <img
                      src={avatar.generatedAvatarUrl || avatar.sourceImage}
                      alt={profile?.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <span className="text-xs font-semibold hidden lg:inline">
                  {profile?.name || 'Maya'}
                </span>
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-rose-600 shadow-subtle hover:opacity-90 transition-opacity"
              >
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 safe-area-pb">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition-all ${
                    isActive
                      ? 'text-rose-600 dark:text-rose-400 font-bold scale-105'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};
