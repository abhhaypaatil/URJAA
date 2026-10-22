import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Heart,
  Flame,
  UtensilsCrossed,
  Activity,
  Calendar as CalendarIcon,
  BarChart3,
  Home,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { UserAvatarBadge } from '../avatar/UserAvatarBadge';

interface NavbarProps {
  onOpenCompanion?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCompanion }) => {
  const { user, profile } = useAuth();
  const companionName = profile?.companion_name || 'Aura';
  const displayName = profile?.name || user?.email?.split('@')[0] || '';

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
      {/* Desktop Top Premium Wellness Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-plum-100/70 dark:border-slate-800/80 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <NavLink to="/home" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-urjaa-rose to-urjaa-blush flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white/20 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl tracking-tight text-plum-950 dark:text-white leading-none">
                Urjaa
              </span>
              <span className="text-[10px] text-urjaa-rose dark:text-blush-300 font-semibold tracking-wider uppercase mt-0.5">
                Cycle-Aware Wellness
              </span>
            </div>
          </NavLink>

          {/* Feature Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-urjaa-ivory/80 dark:bg-slate-800/60 p-1 rounded-2xl border border-plum-100/60 dark:border-slate-700/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-plum-950 dark:text-white shadow-subtle border border-plum-100/40 dark:border-slate-700'
                        : 'text-plum-700 dark:text-slate-400 hover:text-plum-950 dark:hover:text-white'
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-urjaa-lavender/30 hover:bg-urjaa-lavender/50 dark:bg-purple-950/40 dark:hover:bg-purple-950/60 text-xs font-semibold text-plum-900 dark:text-purple-200 border border-urjaa-lavender/80 dark:border-purple-900/60 transition-all active:scale-95"
              title={`Open ${companionName} Wellness Assistant`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-urjaa-rose" />
              <span className="hidden sm:inline">Ask {companionName}</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Pill */}
            {user ? (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-2xl border transition-all ${
                    isActive
                      ? 'border-urjaa-rose bg-urjaa-blush/40 text-plum-950 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                      : 'border-plum-200/70 bg-white text-plum-900 hover:bg-urjaa-ivory dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`
                }
                title="Profile & Settings"
              >
                <UserAvatarBadge
                  avatarId={profile?.avatar_id}
                  avatarUrl={profile?.avatar_url}
                  name={displayName}
                  size={26}
                  showBorder={false}
                />
                <span className="text-xs font-semibold hidden lg:inline">
                  {displayName || 'Profile'}
                </span>
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-plum-950 text-white dark:bg-rose-600 shadow-subtle hover:opacity-90 transition-opacity"
              >
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-plum-100/80 dark:border-slate-800/80 px-2 py-1.5 safe-area-pb">
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
                      ? 'text-urjaa-rose dark:text-rose-400 font-bold scale-105'
                      : 'text-plum-600 hover:text-plum-950 dark:text-slate-400 dark:hover:text-slate-200'
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
