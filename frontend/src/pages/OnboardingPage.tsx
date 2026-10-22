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
  Target,
  Check,
  MapPin,
  Dumbbell,
} from 'lucide-react';
import {
  FITNESS_GOALS,
  WORKOUT_LOCATIONS,
  AVAILABLE_EQUIPMENT,
  PREFERRED_ACTIVITIES,
  DIETARY_PREFERENCES,
  DURATION_OPTIONS,
} from '../constants';
import { DietaryPreference, FitnessLevel } from '../types';
import { AvatarSelector } from '../components/avatar/AvatarSelector';
import { CompanionOrb } from '../components/companion/CompanionOrb';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();

  // Onboarding Step State (4 guided steps)
  const [step, setStep] = useState<number>(1);

  // Cycle inputs
  const [lastPeriodStart, setLastPeriodStart] = useState<string>(
    new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [periodDuration, setPeriodDuration] = useState<number>(5);
  const [avgCycleLength, setAvgCycleLength] = useState<number>(29);
  const [isRegular, setIsRegular] = useState<boolean>(true);

  // Stage 5 Fitness Goal Selection
  const [primaryGoal, setPrimaryGoal] = useState<string>('Build strength');
  const [secondaryGoals, setSecondaryGoals] = useState<string[]>([
    'Improve flexibility and mobility',
  ]);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('Beginner');
  const [preferredDuration, setPreferredDuration] = useState<number>(15);
  const [workoutLocation, setWorkoutLocation] = useState<string>('Home');
  const [availableEquipment, setAvailableEquipment] = useState<string[]>([
    'None (Bodyweight)',
    'Yoga Mat',
  ]);
  const [preferredActivities, setPreferredActivities] = useState<string[]>([
    'Strength Training',
    'Yoga & Mobility',
  ]);
  const [exerciseLimitations, setExerciseLimitations] = useState<string>('');

  // Nutrition & Medical-adjacent inputs
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>('Vegetarian');
  const [pcosMode, setPcosMode] = useState<boolean>(false);

  // Identity & AI Companion inputs
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('solar-bloom');
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | undefined>(undefined);
  const [companionName, setCompanionName] = useState<string>('Aura');
  const [companionTone, setCompanionTone] = useState<string>('Gentle & Nurturing');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleSecondaryGoal = (goalId: string) => {
    if (goalId === primaryGoal) return;
    setSecondaryGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  const toggleEquipment = (item: string) => {
    setAvailableEquipment((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleActivity = (act: string) => {
    setPreferredActivities((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
    );
  };

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
        wellness_goal: primaryGoal,
        primary_goal: primaryGoal,
        secondary_goals: secondaryGoals,
        fitness_level: fitnessLevel,
        preferred_workout_duration: Number(preferredDuration) || 15,
        workout_location: workoutLocation,
        available_equipment: availableEquipment,
        preferred_activities: preferredActivities,
        dietary_preference: dietaryPreference,
        exercise_limitations: limitationsList,
        pcos_pcod_mode: pcosMode,
        avatar_id: selectedAvatarId,
        avatar_url: customAvatarUrl,
        companion_name: companionName.trim() || 'Aura',
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

  const companionSuggestions = ['Aura', 'Mira', 'Nova', 'Sol', 'Lyra', 'Zephyr'];

  return (
    <div className="min-h-screen bg-urjaa-ivory dark:bg-slate-950 text-urjaa-plum dark:text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-xl w-full mx-auto">
        {/* Brand & Progress Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-urjaa-blush/60 dark:bg-rose-950/60 text-xs font-semibold text-plum-900 dark:text-rose-300 mb-2">
            <Heart className="w-3.5 h-3.5 text-urjaa-rose fill-urjaa-rose/20" />
            <span>Personalizing Your Wellness Rhythm</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-plum-950 dark:text-white tracking-tight">
            Tailor Urjaa to Your Body
          </h2>
          <p className="text-xs text-plum-600 dark:text-slate-400 mt-1">
            Align your biological rhythms, personalized workouts, Indian nutrition, and attuned AI companion.
          </p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-urjaa-rose'
                    : s < step
                    ? 'w-4 bg-urjaa-blush'
                    : 'w-4 bg-plum-100 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-plum-100/80 dark:border-slate-800 shadow-soft">
          {/* STEP 1: CYCLE RHYTHM */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-urjaa-rose font-bold text-sm mb-1">
                <Heart className="w-4 h-4 fill-urjaa-rose/20" />
                <span>1. Cycle & Biological Baseline</span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                  When did your last period start?
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={lastPeriodStart}
                    onChange={(e) => setLastPeriodStart(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-urjaa-ivory/60 dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-sm text-plum-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-urjaa-rose"
                    required
                  />
                  <CalendarIcon className="w-4 h-4 text-plum-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                    Bleeding Duration
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={periodDuration}
                    onChange={(e) => setPeriodDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-urjaa-ivory/60 dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-sm text-plum-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-urjaa-rose"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                    Average Cycle Length
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="50"
                    value={avgCycleLength}
                    onChange={(e) => setAvgCycleLength(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-urjaa-ivory/60 dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-sm text-plum-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-urjaa-rose"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                  Cycle Regularity
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRegular(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      isRegular
                        ? 'border-urjaa-rose bg-urjaa-blush/40 text-plum-950 dark:text-white shadow-subtle'
                        : 'border-plum-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-plum-600'
                    }`}
                  >
                    Regular (25–35 days)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegular(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      !isRegular
                        ? 'border-urjaa-rose bg-urjaa-blush/40 text-plum-950 dark:text-white shadow-subtle'
                        : 'border-plum-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-plum-600'
                    }`}
                  >
                    Irregular / Variable
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  variant="blush"
                  className="w-full shadow-soft py-2.5 font-semibold"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => setStep(2)}
                >
                  Continue to Fitness Goals
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: FITNESS GOALS & PERSONALIZATION (Stage 5 Core) */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-urjaa-rose font-bold text-sm mb-0.5">
                <Target className="w-4 h-4" />
                <span>2. Fitness Goals & Personalization</span>
              </div>

              {/* Primary Question Prompt */}
              <div>
                <label className="block text-sm font-serif font-bold text-plum-950 dark:text-white mb-1">
                  What would you most like to work towards?
                </label>
                <p className="text-xs text-plum-600 dark:text-slate-400 mb-2.5">
                  Select your primary intention. We tailor your movement routines and daily quests around this focus.
                </p>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {FITNESS_GOALS.map((goal) => {
                    const isSelected = primaryGoal === goal.id;
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => {
                          setPrimaryGoal(goal.id);
                          setSecondaryGoals((prev) => prev.filter((g) => g !== goal.id));
                        }}
                        className={`w-full p-3 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-urjaa-rose bg-urjaa-blush/40 text-plum-950 dark:text-white ring-2 ring-urjaa-rose shadow-subtle'
                            : 'border-plum-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-plum-800 hover:border-plum-200'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'border-urjaa-rose bg-urjaa-rose text-white'
                              : 'border-plum-300 dark:border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight">{goal.label}</div>
                          <div className="text-[11px] text-plum-600/80 dark:text-slate-400 mt-0.5">
                            {goal.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Goals */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                  Optional Supporting Focus Areas
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FITNESS_GOALS.filter((g) => g.id !== primaryGoal).map((g) => {
                    const isSec = secondaryGoals.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => toggleSecondaryGoal(g.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                          isSec
                            ? 'border-urjaa-lavender bg-urjaa-lavender/40 text-urjaa-plum shadow-subtle'
                            : 'border-plum-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-plum-600'
                        }`}
                      >
                        {isSec ? '✓ ' : '+ '}
                        {g.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fitness Experience & Session Length */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={fitnessLevel}
                    onChange={(e) => setFitnessLevel(e.target.value as FitnessLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-urjaa-ivory/60 dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-xs text-plum-950 dark:text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                    Preferred Session
                  </label>
                  <select
                    value={preferredDuration}
                    onChange={(e) => setPreferredDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-urjaa-ivory/60 dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-xs text-plum-950 dark:text-white"
                  >
                    {DURATION_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m} minutes
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location & Equipment */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                  Workout Location
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {WORKOUT_LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setWorkoutLocation(loc)}
                      className={`py-1.5 px-1 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                        workoutLocation === loc
                          ? 'border-urjaa-rose bg-urjaa-blush/40 text-plum-950 shadow-subtle'
                          : 'border-plum-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-plum-600'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                  Available Equipment
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_EQUIPMENT.map((eq) => {
                    const hasEq = availableEquipment.includes(eq);
                    return (
                      <button
                        key={eq}
                        type="button"
                        onClick={() => toggleEquipment(eq)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                          hasEq
                            ? 'border-urjaa-pistachio bg-urjaa-pistachio/50 text-plum-950'
                            : 'border-plum-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-plum-600'
                        }`}
                      >
                        {hasEq ? '✓ ' : '+ '}
                        {eq}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="w-1/3 text-plum-500"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="blush"
                  className="w-2/3 shadow-soft py-2.5 font-semibold"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => setStep(3)}
                >
                  Continue to Nutrition
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: INDIAN NUTRITION & BODY ACCOMMODATIONS */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-urjaa-rose font-bold text-sm mb-1">
                <UtensilsCrossed className="w-4 h-4" />
                <span>3. Indian Nutrition & Accommodations</span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                  Dietary Preference (Indian Meal Plans)
                </label>
                <div className="space-y-2">
                  {DIETARY_PREFERENCES.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDietaryPreference(d.id as DietaryPreference)}
                      className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${
                        dietaryPreference === d.id
                          ? 'border-urjaa-pistachio bg-urjaa-pistachio/40 text-plum-950 dark:text-white ring-2 ring-urjaa-pistachio shadow-subtle'
                          : 'border-plum-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-plum-700'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{d.label}</span>
                        <span className="text-[11px] text-plum-600/80 dark:text-slate-400 block mt-0.5">
                          {d.id === 'Vegetarian' && 'Poha, Idlis, Dal Tadka, Khichdi, Palak Paneer, Makhana'}
                          {d.id === 'Non-vegetarian' && 'Egg Bhurji, Chicken Curry, Tawa Fish, Masala Eggs'}
                          {d.id === 'Eggetarian' && 'Vegetarian Indian meals with Boiled Eggs & Bhurji'}
                          {d.id === 'Vegan' && '100% plant-based dals, chilla, sabzi, seeds & sprouts'}
                        </span>
                      </div>
                      {dietaryPreference === d.id && (
                        <div className="w-5 h-5 rounded-full bg-urjaa-pistachio text-plum-950 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* PCOS Mode Toggle */}
              <div className="p-3.5 rounded-2xl bg-urjaa-ivory/80 dark:bg-slate-800 border border-plum-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-plum-950 dark:text-white block">
                    PCOS / PCOD Support Protocol
                  </span>
                  <span className="text-[11px] text-plum-600 dark:text-slate-400 block mt-0.5">
                    Prioritizes low-cortisol exercise formats, steady resistance, and low-glycemic Indian meal ideas.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={pcosMode}
                  onChange={(e) => setPcosMode(e.target.checked)}
                  className="w-4 h-4 rounded text-urjaa-rose bg-white dark:bg-slate-700 border-plum-300 focus:ring-urjaa-rose"
                />
              </div>

              {/* Movement limitations / notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                  Movements to Avoid or Accessibility Needs
                </label>
                <input
                  type="text"
                  value={exerciseLimitations}
                  onChange={(e) => setExerciseLimitations(e.target.value)}
                  placeholder="e.g. Sensitive lower back, sensitive knees, avoid jumping"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-urjaa-ivory/60 dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-xs text-plum-950 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(2)}
                  className="w-1/3 text-plum-500"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="blush"
                  className="w-2/3 shadow-soft py-2.5 font-semibold"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => setStep(4)}
                >
                  Identity & Companion
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: IDENTITY & AI COMPANION */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-urjaa-rose font-bold text-sm mb-1">
                <Sparkles className="w-4 h-4" />
                <span>4. Personal Identity & AI Companion</span>
              </div>

              {/* 1. User Avatar Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-2">
                  Choose Your Wellness Avatar
                </label>
                <AvatarSelector
                  selectedId={selectedAvatarId}
                  customUrl={customAvatarUrl}
                  onSelect={(id, url) => {
                    setSelectedAvatarId(id);
                    setCustomAvatarUrl(url);
                  }}
                  isCompact={true}
                />
              </div>

              {/* 2. AI Companion Customization */}
              <div className="pt-3 border-t border-plum-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-urjaa-lavender/30 border border-urjaa-lavender/60">
                    <CompanionOrb name={companionName} state="welcome" size={44} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-plum-950 dark:text-white">
                      Name Your AI Companion
                    </h4>
                    <p className="text-[11px] text-plum-600 dark:text-slate-400">
                      Your non-human celestial companion attuned to your daily rhythm.
                    </p>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={companionName}
                    onChange={(e) => setCompanionName(e.target.value)}
                    placeholder="e.g. Aura"
                    maxLength={24}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-urjaa-ivory/60 dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-sm text-plum-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-urjaa-rose"
                  />
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-plum-500">Suggestions:</span>
                    {companionSuggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setCompanionName(sug)}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                          companionName === sug
                            ? 'bg-urjaa-lavender text-urjaa-plum border-urjaa-lavender font-bold'
                            : 'bg-white dark:bg-slate-800 text-plum-600 border-plum-100'
                        }`}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                    Companion Supportive Tone
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Gentle & Nurturing', 'Mindful & Grounded', 'Direct & Motivating'].map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setCompanionTone(tone)}
                        className={`py-2 px-1 rounded-xl text-[10px] font-semibold border text-center transition-all ${
                          companionTone === tone
                            ? 'border-urjaa-lavender bg-urjaa-lavender/40 text-urjaa-plum shadow-subtle'
                            : 'border-plum-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-plum-600'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(3)}
                  className="w-1/3 text-plum-500"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="blush"
                  className="w-2/3 shadow-soft py-2.5 font-semibold"
                  disabled={isLoading}
                  onClick={handleFinish}
                  rightIcon={<Sparkles className="w-4 h-4 text-urjaa-rose" />}
                >
                  {isLoading ? 'Personalizing...' : 'Enter Urjaa'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
