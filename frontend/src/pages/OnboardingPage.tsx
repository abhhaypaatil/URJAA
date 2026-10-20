import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Button } from '../components/common/Button';
import {
  Calendar as CalendarIcon,
  Sparkles,
  ArrowRight,
  Heart,
  Activity,
  UtensilsCrossed,
} from 'lucide-react';
import { WELLNESS_GOALS, DIETARY_PREFERENCES, DURATION_OPTIONS } from '../constants';
import { DietaryPreference, FitnessLevel } from '../types';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();

  // Onboarding Step State (3 quick micro-steps)
  const [step, setStep] = useState<number>(1);

  // Cycle inputs
  const [lastPeriodStart, setLastPeriodStart] = useState<string>(
    new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [periodDuration, setPeriodDuration] = useState<number>(5);
  const [avgCycleLength, setAvgCycleLength] = useState<number>(29);
  const [isRegular, setIsRegular] = useState<boolean>(true);

  // Wellness & Fitness inputs
  const [wellnessGoal, setWellnessGoal] = useState<string>('Hormonal Balance & Gentle Energy');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('Beginner');
  const [preferredDuration, setPreferredDuration] = useState<number>(15);

  // Nutrition & Medical-adjacent inputs
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>('Vegetarian');
  const [exerciseLimitations, setExerciseLimitations] = useState<string>('');
  const [pcosMode, setPcosMode] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const limitationsList = exerciseLimitations
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await api.completeOnboarding({
        last_period_start: lastPeriodStart,
        period_duration: Number(periodDuration) || 5,
        avg_cycle_length: Number(avgCycleLength) || 29,
        is_regular: isRegular,
        wellness_goal: wellnessGoal,
        fitness_level: fitnessLevel,
        preferred_workout_duration: Number(preferredDuration) || 15,
        dietary_preference: dietaryPreference,
        exercise_limitations: limitationsList,
        pcos_pcod_mode: pcosMode,
      });

      await refreshUserData();
      navigate('/home');
    } catch (err) {
      console.error('Failed onboarding', err);
      navigate('/home');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-xl w-full mx-auto">
        {/* Brand & Progress Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-xs font-semibold text-rose-800 dark:text-rose-300 mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 fill-rose-500/20" />
            <span>Personalizing Your Wellness Plan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
            Tailor Urjaa to Your Body
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            A few baseline details to align your workouts, recipes, and cycle insights.
          </p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-rose-600 dark:bg-rose-500'
                    : s < step
                    ? 'w-4 bg-rose-300 dark:bg-rose-800'
                    : 'w-4 bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* STEP 1: CYCLE RHYTHM */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm mb-1">
                <Heart className="w-4 h-4 fill-rose-500/20" />
                <span>1. Cycle & Biological Baseline</span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  When did your last period start?
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={lastPeriodStart}
                    onChange={(e) => setLastPeriodStart(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                  <CalendarIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Flow Duration (Days)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={12}
                    value={periodDuration}
                    onChange={(e) => setPeriodDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Cycle Length (Days)
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={45}
                    value={avgCycleLength}
                    onChange={(e) => setAvgCycleLength(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Are your cycles usually regular?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRegular(true)}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      isRegular
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-warm-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Yes, Regular
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegular(false)}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      !isRegular
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-warm-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Irregular / Variable
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  className="w-full shadow-sm py-2.5"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => setStep(2)}
                >
                  Continue to Movement
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: FITNESS & MOVEMENT */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm mb-1">
                <Activity className="w-4 h-4" />
                <span>2. Movement Energy & Goals</span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Primary Wellness Focus
                </label>
                <select
                  value={wellnessGoal}
                  onChange={(e) => setWellnessGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {WELLNESS_GOALS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Current Movement Starting Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as FitnessLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFitnessLevel(lvl)}
                      className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        fitnessLevel === lvl
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-warm-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Preferred Session Length
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {DURATION_OPTIONS.slice(0, 4).map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setPreferredDuration(mins)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        preferredDuration === mins
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-warm-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="w-1/3 text-slate-500"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="w-2/3 shadow-sm py-2.5"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => setStep(3)}
                >
                  Continue to Nutrition
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: NUTRITION & ADAPTATIONS */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-1">
                <UtensilsCrossed className="w-4 h-4" />
                <span>3. Nutrition & Health Preferences</span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Dietary Preference
                </label>
                <div className="space-y-2">
                  {DIETARY_PREFERENCES.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDietaryPreference(d.id as DietaryPreference)}
                      className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                        dietaryPreference === d.id
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-slate-900 dark:text-white shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-warm-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-semibold">{d.label}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{d.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PCOS Mode Toggle */}
              <div className="p-3.5 rounded-xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">PCOS / PCOD Support Mode</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Selects gentle low-cortisol exercises and low-glycemic meal options.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={pcosMode}
                  onChange={(e) => setPcosMode(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-rose-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(2)}
                  className="w-1/3 text-slate-500"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="w-2/3 shadow-sm py-2.5"
                  disabled={isLoading}
                  onClick={handleFinish}
                  rightIcon={<Sparkles className="w-4 h-4" />}
                >
                  {isLoading ? 'Saving...' : 'Enter Urjaa'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
