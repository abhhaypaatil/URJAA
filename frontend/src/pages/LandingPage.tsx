import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Heart, UtensilsCrossed, Flame, Calendar as CalendarIcon, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-warm-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 flex items-center justify-center text-white shadow-soft">
            <Sparkles className="w-5 h-5 fill-white/20" />
          </div>
          <span className="font-serif font-bold text-2xl tracking-tight">Urjaa</span>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-900/60 text-xs font-semibold text-rose-700 dark:text-rose-300 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cycle-Aware Women's Wellness</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-serif font-extrabold tracking-tight leading-tight md:leading-[1.15] text-slate-900 dark:text-white max-w-3xl">
          Track less. Understand more.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-600 to-sapphire-600">
            Recommend better.
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mt-6 leading-relaxed">
          Urjaa transforms a 20-second daily check-in into personalized cycle-aware nutrition, gentle recovery, and strength recommendations that adjust to how you feel today.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full sm:w-auto">
          <Link to="/register" className="w-full sm:w-auto">
            <Button size="lg" variant="rose" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Start Your Wellness Rhythm
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              I Already Have an Account
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-16 text-left w-full">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Cycle Intelligence</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              4-phase hormonal estimation with transparent confidence scores without 28-day assumptions.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-sapphire-50 dark:bg-sapphire-950/60 text-sapphire-600 flex items-center justify-center mb-3">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Guided Movement</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Quiet bodyweight sessions with looping SVG guides, timers, and step-down regression chains.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-sage-50 dark:bg-sage-950/60 text-sage-600 flex items-center justify-center mb-3">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Cycle Nutrition</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Micronutrient-dense meal plans respecting your diet (Veg, Vegan, Eggetarian, Non-veg).
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-3">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Visual Calendar</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Supportive monthly view tracking workouts, hydration, mood, and gentle consistency.
            </p>
          </div>
        </div>

        <div className="mt-12 w-full max-w-xl">
          <DisclaimerBanner />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-100 dark:border-slate-900 text-center text-xs text-slate-400">
        © 2026 Urjaa. Respecting privacy and bodily rhythms.
      </footer>
    </div>
  );
};
