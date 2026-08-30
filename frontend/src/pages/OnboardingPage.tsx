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
  Shield,
} from 'lucide-react';
import { WELLNESS_GOALS, DIETARY_PREFERENCES, DURATION_OPTIONS, MEDICAL_DISCLAIMER } from '../constants';
import { DietaryPreference, FitnessLevel } from '../types';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();

  // Onboarding Step State (3 quick micro-steps: Cycle -> Fitness & Goals -> Nutrition & Health)
  const [step, setStep] = useState<number>(1);

  // Cycle inputs
  const [lastPeriodStart, setLastPeriodStart] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [periodDuration, setPeriodDuration] = useState<number>(5);
  const [avgCycleLength, setAvgCycleLength] = useState<number>(28);
  const [isRegular, setIsRegular] = useState<boolean>(true);

  // Wellness & Fitness inputs
  const [wellnessGoal, setWellnessGoal] = useState<string>('Better overall health');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('Beginner'); // Default Beginner always per §4
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
        avg_cycle_length: Number(avgCycleLength) || 28,
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-slate-950 flex flex-col justify-center py-10 px-4 sm:px-6 max-w-xl mx-auto">
      {/* Brand & Progress Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick 30-Second Setup</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Tune Urjaa to Your Body
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          No endless questionnaires. Just enough to guide you thoughtfully.
        </p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-rose-600'
                  : s < step
                  ? 'w-4 bg-rose-300 dark:bg-rose-900'
                  : 'w-4 bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-soft">
        {/* STEP 1: CYCLE RHYTHM */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-1">
              <Heart className="w-4 h-4" />
              <span>1. Your Cycle Baseline</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                When did your last period start?
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={lastPeriodStart}
                  onChange={(e) => setLastPeriodStart(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
                  required
                />
                <CalendarIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Period Duration (Days)
                </label>
                <input
                  type="number"
                  min={2}
                  max={12}
                  value={periodDuration}
                  onChange={(e) => setPeriodDuration(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cycle Length (Days)
                </label>
                <input
                  type="number"
                  min={20}
                  max={45}
                  value={avgCycleLength}
                  onChange={(e) => setAvgCycleLength(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Are your cycles usually regular?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegular(true)}
                  className={`py-2 rounded-2xl text-xs font-semibold border transition-all ${
                    isRegular
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                      : 'border-slate-200 dark:border-slate-800 bg-warm-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Yes, Regular
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegular(false)}
                  className={`py-2 rounded-2xl text-xs font-semibold border transition-all ${
                    !isRegular
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                      : 'border-slate-200 dark:border-slate-800 bg-warm-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Somewhat Irregular
                </button>
              </div>
            </div>

            <Button
              type="button"
              variant="rose"
              className="w-full mt-4"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setStep(2)}
            >
              Continue to Fitness & Goals
            </Button>
          </div>
        )}

        {/* STEP 2: FITNESS & GOALS */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-1">
              <Activity className="w-4 h-4" />
              <span>2. Movement & Wellness Goals</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Main Wellness Goal
              </label>
              <div className="grid grid-cols-2 gap-2">
                {WELLNESS_GOALS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setWellnessGoal(g)}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-medium border text-left transition-all ${
                      wellnessGoal === g
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-warm-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Fitness Experience Level (Defaults to Beginner)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as FitnessLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFitnessLevel(lvl)}
                    className={`py-2 rounded-2xl text-xs font-semibold border transition-all ${
                      fitnessLevel === lvl
                        ? 'border-slate-900 bg-slate-900 text-white dark:border-rose-500 dark:bg-rose-600'
                        : 'border-slate-200 dark:border-slate-800 bg-warm-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Preferred Workout Duration
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {DURATION_OPTIONS.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setPreferredDuration(mins)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      preferredDuration === mins
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        : 'border-slate-200 dark:border-slate-800 bg-warm-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="w-1/3" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                type="button"
                variant="rose"
                className="w-2/3"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setStep(3)}
              >
                Continue to Nutrition
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: NUTRITION & OPTIONAL PCOS MODE */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-1">
              <UtensilsCrossed className="w-4 h-4" />
              <span>3. Dietary & Health Preferences</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Dietary Preference (Conflicting foods will never be recommended)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DIETARY_PREFERENCES.map((diet) => (
                  <button
                    key={diet.id}
                    type="button"
                    onClick={() => setDietaryPreference(diet.id as DietaryPreference)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      dietaryPreference === diet.id
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200'
                        : 'border-slate-200 dark:border-slate-800 bg-warm-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold block">{diet.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{diet.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional PCOS/PCOD Support Mode */}
            <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Shield className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Optional PCOS / PCOD Mode
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Adapts recommendations toward insulin sensitivity, anti-inflammatory whole foods, and low-impact consistency.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={pcosMode}
                  onChange={(e) => setPcosMode(e.target.checked)}
                  className="w-5 h-5 rounded-md text-rose-600 focus:ring-rose-500 mt-1 cursor-pointer"
                />
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
              {MEDICAL_DISCLAIMER}
            </p>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="w-1/3" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                type="button"
                variant="rose"
                className="w-2/3"
                isLoading={isLoading}
                onClick={handleFinish}
              >
                Complete Setup & Start
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
