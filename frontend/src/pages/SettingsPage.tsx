import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/common/Button';
import {
  Settings,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Bot,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { MEDICAL_DISCLAIMER } from '../constants';
import { CompanionOrb } from '../components/companion/CompanionOrb';

export const SettingsPage: React.FC = () => {
  const { profile, preferences, refreshUserData } = useAuth();
  const { theme, setTheme } = useTheme();

  // Companion personalization
  const [companionName, setCompanionName] = useState<string>(
    profile?.companion_name || 'Aura'
  );
  const [companionTone, setCompanionTone] = useState<string>('Gentle & Nurturing');

  // Notification toggles
  const [notifyPeriod, setNotifyPeriod] = useState<boolean>(preferences?.notify_period ?? true);
  const [notifyCheckin, setNotifyCheckin] = useState<boolean>(preferences?.notify_checkin ?? true);
  const [notifyHydration, setNotifyHydration] = useState<boolean>(preferences?.notify_hydration ?? true);
  const [notifyWorkout, setNotifyWorkout] = useState<boolean>(preferences?.notify_workout ?? true);
  const [notifyNutrition, setNotifyNutrition] = useState<boolean>(preferences?.notify_nutrition ?? true);
  const [notifyInsights, setNotifyInsights] = useState<boolean>(preferences?.notify_insights ?? true);

  // App flags
  const [quietMode, setQuietMode] = useState<boolean>(preferences?.quiet_mode ?? false);
  const [pcosMode, setPcosMode] = useState<boolean>(profile?.pcos_pcod_mode ?? false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [clearSuccess, setClearSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (preferences) {
      setNotifyPeriod(preferences.notify_period);
      setNotifyCheckin(preferences.notify_checkin);
      setNotifyHydration(preferences.notify_hydration);
      setNotifyWorkout(preferences.notify_workout);
      setNotifyNutrition(preferences.notify_nutrition);
      setNotifyInsights(preferences.notify_insights);
      setQuietMode(preferences.quiet_mode);
      if (preferences.companion_name) {
        setCompanionName(preferences.companion_name);
      }
    }
    if (profile) {
      setPcosMode(profile.pcos_pcod_mode);
      if (profile.companion_name) {
        setCompanionName(profile.companion_name);
      }
    }
  }, [preferences, profile]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.updateSettings({
        theme_preference: theme,
        quiet_mode: quietMode,
        companion_name: companionName.trim() || 'Aura',
        notify_period: notifyPeriod,
        notify_checkin: notifyCheckin,
        notify_hydration: notifyHydration,
        notify_workout: notifyWorkout,
        notify_nutrition: notifyNutrition,
        notify_insights: notifyInsights,
      });

      await api.updateProfile({
        companion_name: companionName.trim() || 'Aura',
        pcos_pcod_mode: pcosMode,
      });

      await refreshUserData();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearPersonalization = async () => {
    setIsClearing(true);
    try {
      await api.clearPersonalization();
      await refreshUserData();
      setClearSuccess(true);
      setTimeout(() => setClearSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to clear personalization', err);
    } finally {
      setIsClearing(false);
    }
  };

  const nameSuggestions = ['Aura', 'Mira', 'Nova', 'Sol', 'Lyra', 'Zephyr'];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="pb-2 border-b border-plum-100/70 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-plum-600 dark:text-slate-400 mb-1">
          <Settings className="w-4 h-4 text-urjaa-rose" />
          <span className="uppercase tracking-wider font-mono text-[11px]">Preferences & Companions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-plum-950 dark:text-white tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-plum-600 dark:text-slate-400 mt-1">
          Customize your AI companion, appearance theme, PCOS accommodations, and daily notifications.
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* 1. AI Companion Personalization Card */}
      <div className="rounded-3xl border border-urjaa-lavender/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-2xl bg-urjaa-lavender/30 border border-urjaa-lavender/60">
              <CompanionOrb name={companionName} state="welcome" size={44} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-plum-950 dark:text-white">
                AI Companion Identity
              </h3>
              <p className="text-xs text-plum-600 dark:text-slate-400">
                Attuned to your cycle phases, affirmations, and personalized rhythm.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-urjaa-lavender/50 text-urjaa-plum">
            Active: {companionName}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-plum-900 dark:text-slate-300 mb-1.5">
            Companion Name
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={companionName}
              onChange={(e) => setCompanionName(e.target.value)}
              placeholder="e.g. Aura"
              className="flex-1 px-4 py-2 text-sm rounded-xl border border-plum-200 dark:border-slate-700 bg-warm-50/50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-urjaa-rose text-plum-950 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="text-[11px] text-plum-500 dark:text-slate-400 mr-1">Suggestions:</span>
            {nameSuggestions.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setCompanionName(name)}
                className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-colors ${
                  companionName === name
                    ? 'bg-urjaa-rose text-white border-urjaa-rose'
                    : 'bg-ivory-100 dark:bg-slate-800 text-plum-700 dark:text-slate-300 border-plum-200 dark:border-slate-700 hover:border-urjaa-rose'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Theme & Appearance Preference */}
      <div className="rounded-3xl border border-plum-100/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-soft space-y-3">
        <h3 className="font-serif font-bold text-base text-plum-950 dark:text-white">
          Appearance & Theme
        </h3>
        <p className="text-xs text-plum-600 dark:text-slate-400">
          Select your preferred celestial visual mode.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
              theme === 'light'
                ? 'border-urjaa-rose bg-blush-50/60 dark:bg-slate-800 text-urjaa-plum shadow-soft'
                : 'border-plum-200/80 dark:border-slate-700 hover:border-urjaa-rose/60 text-plum-700 dark:text-slate-300'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Dawn Light</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
              theme === 'dark'
                ? 'border-urjaa-rose bg-slate-900 text-white shadow-soft ring-1 ring-urjaa-rose'
                : 'border-plum-200/80 dark:border-slate-700 hover:border-urjaa-rose/60 text-plum-700 dark:text-slate-300'
            }`}
          >
            <Moon className="w-4 h-4 text-urjaa-rose" />
            <span>Cosmic Night</span>
          </button>
        </div>
      </div>

      {/* 3. PCOS / PCOD Accommodations Mode */}
      <div className="rounded-3xl border border-plum-100/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-soft flex items-center justify-between">
        <div className="pr-4">
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-sm text-plum-950 dark:text-white">
              PCOS / PCOD Accommodations Mode
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pistachio-100 text-pistachio-800 dark:bg-emerald-950 dark:text-emerald-300">
              Gentle Pacing
            </span>
          </div>
          <p className="text-xs text-plum-600 dark:text-slate-400 mt-1 leading-relaxed">
            Adapts workouts to low-cortisol steady sessions, prioritizes low-glycemic Indian meals, and softens prediction confidence.
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={pcosMode}
            onChange={(e) => setPcosMode(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-plum-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-plum-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-urjaa-rose" />
        </label>
      </div>

      {/* 4. Quiet Mode (No Jumping / Apartments) */}
      <div className="rounded-3xl border border-plum-100/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-soft flex items-center justify-between">
        <div className="pr-4">
          <h3 className="font-serif font-bold text-sm text-plum-950 dark:text-white">
            Quiet Home Mode (Zero Jumping)
          </h3>
          <p className="text-xs text-plum-600 dark:text-slate-400 mt-1 leading-relaxed">
            Replaces jumping jacks and high-impact cardio with silent, knee-friendly grounding movements for apartments.
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={quietMode}
            onChange={(e) => setQuietMode(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-plum-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-plum-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-urjaa-rose" />
        </label>
      </div>

      {/* 5. Notification Preferences */}
      <div className="rounded-3xl border border-plum-100/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-soft space-y-3">
        <div className="flex items-center gap-2 text-plum-950 dark:text-white font-bold text-sm mb-1">
          <Bell className="w-4 h-4 text-urjaa-rose" />
          <span>Notifications & Daily Reminders</span>
        </div>

        {[
          { label: 'Upcoming Cycle & Period Notice', checked: notifyPeriod, setter: setNotifyPeriod },
          { label: 'Daily 20-Second Check-in Reminder', checked: notifyCheckin, setter: setNotifyCheckin },
          { label: 'Gentle Hydration Prompts', checked: notifyHydration, setter: setNotifyHydration },
          { label: 'Today’s Workout Movement Suggestion', checked: notifyWorkout, setter: setNotifyWorkout },
          { label: 'Meal & Nutrition Recipe Ideas', checked: notifyNutrition, setter: setNotifyNutrition },
          { label: 'Weekly Rhythm & Health Insights', checked: notifyInsights, setter: setNotifyInsights },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b border-plum-100/60 dark:border-slate-800 last:border-0 text-xs">
            <span className="text-plum-800 dark:text-slate-300 font-medium">{item.label}</span>
            <input
              type="checkbox"
              checked={item.checked}
              onChange={(e) => item.setter(e.target.checked)}
              className="w-4 h-4 rounded text-urjaa-rose bg-white dark:bg-slate-800 border-plum-300 focus:ring-urjaa-rose"
            />
          </div>
        ))}
      </div>

      {/* 6. Consent-Based Personalization & Privacy Memory (Stage 6) */}
      <div className="rounded-3xl border border-plum-100/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pistachio-100 dark:bg-emerald-950/60 flex items-center justify-center text-pistachio-700 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-plum-950 dark:text-white">
                Personalization & Privacy Memory
              </h3>
              <p className="text-xs text-plum-600 dark:text-slate-400">
                Transparent memory used to personalize workouts, Indian meals, and Aura guidance.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-pistachio-100 dark:bg-emerald-900/40 text-pistachio-800 dark:text-emerald-300">
            Account-Scoped
          </span>
        </div>

        {clearSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Personalization history cleared. Baseline recommendations restored without affecting your earned XP or levels.</span>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-ivory-50 dark:bg-slate-800/60 border border-plum-100/60 dark:border-slate-700/60 space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-plum-100/40 dark:border-slate-700/40">
            <span className="text-plum-600 dark:text-slate-400">Primary Goal:</span>
            <span className="font-semibold text-plum-950 dark:text-white">{profile?.primary_goal || profile?.wellness_goal || 'Build strength'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-plum-100/40 dark:border-slate-700/40">
            <span className="text-plum-600 dark:text-slate-400">Experience & Duration:</span>
            <span className="font-semibold text-plum-950 dark:text-white">{profile?.fitness_level || 'Beginner'} • {profile?.preferred_workout_duration || 15} min</span>
          </div>
          <div className="flex justify-between py-1 border-b border-plum-100/40 dark:border-slate-700/40">
            <span className="text-plum-600 dark:text-slate-400">Nutrition Preference:</span>
            <span className="font-semibold text-plum-950 dark:text-white">{profile?.dietary_preference || 'Vegetarian'}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-plum-600 dark:text-slate-400">Privacy Guarantee:</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">Never added to public AI models</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-plum-500 dark:text-slate-400 max-w-sm">
            You can clear recommendation memory anytime. Your profile and lifetime XP will remain intact.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearPersonalization}
            disabled={isClearing}
            className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/60"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            <span>{isClearing ? 'Clearing...' : 'Clear History'}</span>
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <Button
        variant="blush"
        size="lg"
        onClick={handleSave}
        disabled={isLoading}
        className="w-full shadow-soft py-3 font-semibold"
      >
        {isLoading ? 'Saving...' : 'Save Settings'}
      </Button>

      {/* Disclaimer */}
      <p className="text-[10px] text-plum-400 dark:text-slate-400 text-center leading-relaxed mt-4 max-w-xl mx-auto">
        {MEDICAL_DISCLAIMER}
      </p>
    </div>
  );
};
