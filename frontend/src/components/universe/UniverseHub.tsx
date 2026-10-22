import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Flame,
  UtensilsCrossed,
  Activity,
  Calendar as CalendarIcon,
  BarChart3,
  Sparkles,
  Droplets,
  ArrowRight,
  Shield,
  Zap,
  Play,
  Check,
  User,
} from 'lucide-react';
import { useAvatar } from '../../context/AvatarContext';
import { PhaseInfo, DailyCheckin, Workout, RecommendedMeal } from '../../types';

interface UniverseHubProps {
  userName: string;
  phaseInfo: PhaseInfo | null;
  checkin: DailyCheckin | null;
  recommendedWorkout: Workout | null;
  todayMeals: RecommendedMeal[];
  waterML: number;
  onAddWater: (amount: number) => void;
  onOpenCompanion: () => void;
  onOpenPeriodLogger: () => void;
}

export const UniverseHub: React.FC<UniverseHubProps> = ({
  userName,
  phaseInfo,
  checkin,
  recommendedWorkout,
  todayMeals,
  waterML,
  onAddWater,
  onOpenCompanion,
  onOpenPeriodLogger,
}) => {
  const navigate = useNavigate();
  const { avatar } = useAvatar();
  const [activePortal, setActivePortal] = useState<string | null>(null);

  const phase = phaseInfo?.current_phase || 'Follicular';
  const cycleDay = phaseInfo?.cycle_day || 9;

  // Portals configuration
  const portals = [
    {
      id: 'cycle',
      title: 'Rhythm Sanctuary',
      tagline: 'Hormonal Intelligence',
      icon: Heart,
      route: '/cycle',
      accent: 'from-rose-500 to-rose-600',
      badge: `${phase} • Day ${cycleDay}`,
      subtext: `${phaseInfo?.days_until_next_period || 20}d to next cycle`,
      glowColor: 'rgba(244, 63, 94, 0.4)',
    },
    {
      id: 'workout',
      title: 'Kinetic Forge',
      tagline: 'Adaptive Movement',
      icon: Flame,
      route: '/workout',
      accent: 'from-amber-500 to-rose-500',
      badge: recommendedWorkout ? `${recommendedWorkout.estimated_duration_min} min session` : 'Daily Flow',
      subtext: recommendedWorkout?.title || 'Follicular Energizer',
      glowColor: 'rgba(245, 158, 11, 0.4)',
    },
    {
      id: 'nutrition',
      title: 'Alchemy Kitchen',
      tagline: 'Cycle-Targeted Nutrition',
      icon: UtensilsCrossed,
      route: '/nutrition',
      accent: 'from-emerald-500 to-teal-600',
      badge: `${todayMeals.filter((m) => m.completed).length}/${todayMeals.length || 4} Nourished`,
      subtext: todayMeals[0]?.meal.title || 'Power Bowl',
      glowColor: 'rgba(52, 211, 153, 0.4)',
    },
    {
      id: 'checkin',
      title: 'Biometric Pulse',
      tagline: '20-Sec Daily Check-in',
      icon: Activity,
      route: '/check-in',
      accent: 'from-sky-400 to-blue-600',
      badge: checkin?.energy ? `${checkin.energy} Energy` : 'Check-in Ready',
      subtext: `${waterML} ml Hydration`,
      glowColor: 'rgba(56, 189, 248, 0.4)',
    },
    {
      id: 'calendar',
      title: 'Temporal Orbit',
      tagline: 'Visual Month Rhythms',
      icon: CalendarIcon,
      route: '/calendar',
      accent: 'from-nebula-500 to-indigo-600',
      badge: '9 Filter Lenses',
      subtext: '92% Consistency Score',
      glowColor: 'rgba(168, 85, 247, 0.4)',
    },
    {
      id: 'insights',
      title: 'Neural Core',
      tagline: 'Bio-Trends & Analytics',
      icon: BarChart3,
      route: '/insights',
      accent: 'from-indigo-500 to-cyan-500',
      badge: 'Harmony Score 94',
      subtext: 'Hormonal & mood trends',
      glowColor: 'rgba(99, 102, 241, 0.4)',
    },
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Personalized Universe Banner */}
      <div className="w-full text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-rose-300 font-semibold mb-3 shadow-soft backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>My Universe • {avatar.title}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
          Welcome Home,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-nebula-300 to-sky-400">
            {userName}
          </span>
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
          Your digital sanctuary is synchronized with your biological clock. Explore each realm,
          harmonize your energy, or consult your intelligent companion.
        </p>
      </div>

      {/* CENTRAL AVATAR NEXUS */}
      <div className="relative my-4 flex flex-col items-center justify-center z-20">
        {/* Pulsing Concentric Energy Rings */}
        <div className="absolute -inset-10 sm:-inset-16 rounded-full border border-rose-500/15 animate-spin [animation-duration:50s] pointer-events-none" />
        <div className="absolute -inset-6 sm:-inset-10 rounded-full border border-nebula-500/20 animate-spin [animation-direction:reverse] [animation-duration:35s] pointer-events-none" />

        {/* Avatar Core */}
        <div
          onClick={() => navigate('/avatar-studio')}
          className="relative group cursor-pointer"
          title="Click to enter Avatar Studio"
        >
          {/* Ambient Aura Bloom */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-rose-500/40 via-nebula-500/30 to-sky-400/40 blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse-subtle" />

          {/* Avatar Ring */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-tr from-rose-500 via-nebula-500 to-sky-400 shadow-cosmic-glow group-hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-cosmic-950 overflow-hidden relative">
              {avatar.generatedAvatarUrl ? (
                <img
                  src={avatar.generatedAvatarUrl}
                  alt={userName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-rose-950 to-cosmic-900 flex items-center justify-center text-rose-300">
                  <User className="w-16 h-16 opacity-80" />
                </div>
              )}

              {/* Studio overlay indicator */}
              <div className="absolute inset-0 bg-cosmic-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-semibold gap-1">
                <Sparkles className="w-4 h-4 text-rose-300" />
                <span>Avatar Studio</span>
              </div>
            </div>
          </div>

          {/* Energy Status Pill */}
          <div className="absolute -bottom-3 inset-x-0 flex justify-center">
            <span className="px-3.5 py-1 rounded-full bg-cosmic-950 border border-slate-700/80 text-[11px] font-bold text-rose-300 shadow-lg flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>{phase} • {avatar.energyLevel}% Vitality</span>
            </span>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="w-full max-w-2xl mt-8 mb-8 p-3 rounded-2xl glass-panel shadow-soft flex flex-wrap items-center justify-center gap-2 sm:gap-3 z-10">
        <button
          onClick={() => navigate('/check-in')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-xs font-semibold text-sky-300 transition-all active:scale-95"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Quick Check-in (20s)</span>
        </button>

        <button
          onClick={() => onAddWater(250)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-xs font-semibold text-blue-300 transition-all active:scale-95"
          title="Add 250ml water"
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>+250ml Hydrate ({waterML}ml)</span>
        </button>

        <button
          onClick={onOpenPeriodLogger}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-all active:scale-95"
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Log Period</span>
        </button>

        <button
          onClick={onOpenCompanion}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-nebula-500/15 hover:bg-nebula-500/25 border border-nebula-500/30 text-xs font-semibold text-nebula-300 transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Summon Aura</span>
        </button>
      </div>

      {/* INTERACTIVE UNIVERSE REALMS GRID */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 z-10">
        {portals.map((portal) => {
          const Icon = portal.icon;
          const isHovered = activePortal === portal.id;

          return (
            <Link
              key={portal.id}
              to={portal.route}
              onMouseEnter={() => setActivePortal(portal.id)}
              onMouseLeave={() => setActivePortal(null)}
              className="group relative p-5 sm:p-6 rounded-3xl glass-panel hover:bg-cosmic-850/80 border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-soft hover:shadow-soft-lg flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle accent gradient behind card on hover */}
              <div
                className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-tr ${portal.accent}`}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${portal.accent} p-0.5 shadow-soft group-hover:scale-105 transition-transform`}
                  >
                    <div className="w-full h-full rounded-2xl bg-cosmic-950 flex items-center justify-center text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60">
                    {portal.badge}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                  {portal.tagline}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
                  {portal.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {portal.subtext}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                <span>Enter Realm</span>
                <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
