import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Heart,
  UtensilsCrossed,
  Flame,
  Calendar as CalendarIcon,
  Activity,
  Zap,
  CheckCircle2,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginDemo } = useAuth();

  const handleInstantDemo = async () => {
    try {
      await loginDemo();
      navigate('/home');
    } catch (e) {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-rose-500/20 selection:text-rose-900">
      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 flex items-center justify-between border-b border-warm-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-sm">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
              Urjaa
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
              Cycle-Aware Living
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <a href="#cycle" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
            Cycle Intelligence
          </a>
          <a href="#movement" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
            Movement
          </a>
          <a href="#nutrition" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
            Nutrition
          </a>
          <a href="#habits" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
            Habit Calendar
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleInstantDemo}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-xs font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Instant Demo</span>
          </button>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-slate-700 dark:text-slate-300">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm" className="shadow-sm">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/70 dark:bg-rose-950/60 text-xs font-semibold text-rose-800 dark:text-rose-300 mb-6 border border-rose-200 dark:border-rose-900/50">
          <Sparkles className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span>One App &bull; Multiple Purpose-Built Experiences</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight leading-tight text-slate-900 dark:text-white max-w-4xl">
          Move, nourish, and rest in rhythm with your body.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mt-5 leading-relaxed">
          Urjaa adapts your workouts, daily meal plans, and self-care to your real hormonal phases. 
          No rigid 28-day assumptions, no punishing routines—just scientifically grounded lifestyle care.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full sm:w-auto">
          <Button
            size="lg"
            variant="primary"
            className="w-full sm:w-auto text-sm px-6 py-3 shadow-sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={handleInstantDemo}
          >
            Explore Interactive Demo
          </Button>
          <Link to="/register" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm px-6 py-3">
              Create Free Account
            </Button>
          </Link>
        </div>

        {/* Feature Grid with Distinct Personalities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-16 text-left w-full">
          {/* Cycle */}
          <div id="cycle" className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-sm hover:shadow-card transition-all">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
              <Heart className="w-5 h-5 fill-rose-500/20" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Cycle Intelligence</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Adaptive hormonal tracking that adjusts to your natural cycle variations, PCOS symptoms, and flow logs.
            </p>
          </div>

          {/* Workouts */}
          <div id="movement" className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-card transition-all">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Athletic Movement</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              50+ guided exercises with animated cues, apartment-friendly quiet modes, and phase-tailored intensity.
            </p>
          </div>

          {/* Nutrition */}
          <div id="nutrition" className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-card transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Culinary Nutrition</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Wholesome phase-specific recipes across Vegetarian, Vegan, Eggetarian, and Non-veg with 1-tap swaps.
            </p>
          </div>

          {/* Daily Check-in */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-card transition-all">
            <div className="w-10 h-10 rounded-2xl bg-sapphire-50 dark:bg-sapphire-950/50 text-sapphire-600 dark:text-sapphire-400 flex items-center justify-center mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">20-Second Check-in</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Low-friction daily tracking for energy, mood, hydration, pelvic cramps, bloating, and restorative sleep.
            </p>
          </div>

          {/* Calendar */}
          <div id="habits" className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-card transition-all">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Habit & Cycle Calendar</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Multi-layer monthly calendar with 9 filter lenses, supportive streaks, and day-by-day detail inspectors.
            </p>
          </div>

          {/* Companion */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-card transition-all">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Aura Companion</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Conversational wellness guidance tuned to your current cycle phase and personal health goals.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-warm-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <DisclaimerBanner />
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
            <span>&copy; {new Date().getFullYear()} Urjaa. Purposeful, cycle-aware health and lifestyle application.</span>
            <span>Privacy-First &bull; Non-Restrictive &bull; Evidence-Based</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
