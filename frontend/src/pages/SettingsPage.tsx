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
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { MEDICAL_DISCLAIMER } from '../constants';

export const SettingsPage: React.FC = () => {
  const { profile, preferences, refreshUserData } = useAuth();
  const { theme, setTheme } = useTheme();

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

  useEffect(() => {
    if (preferences) {
      setNotifyPeriod(preferences.notify_period);
      setNotifyCheckin(preferences.notify_checkin);
      setNotifyHydration(preferences.notify_hydration);
      setNotifyWorkout(preferences.notify_workout);
      setNotifyNutrition(preferences.notify_nutrition);
      setNotifyInsights(preferences.notify_insights);
      setQuietMode(preferences.quiet_mode);
    }
    if (profile) {
      setPcosMode(profile.pcos_pcod_mode);
    }
  }, [preferences, profile]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.updateSettings({
        theme_preference: theme,
        quiet_mode: quietMode,
        notify_period: notifyPeriod,
        notify_checkin: notifyCheckin,
        notify_hydration: notifyHydration,
        notify_workout: notifyWorkout,
        notify_nutrition: notifyNutrition,
        notify_insights: notifyInsights,
      });

      if (profile && profile.pcos_pcod_mode !== pcosMode) {
        await api.updateProfile({ pcos_pcod_mode: pcosMode });
      }

      await refreshUserData();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
          <Settings className="w-4 h-4 text-sapphire-600 dark:text-sapphire-400" />
          <span className="uppercase tracking-wider font-mono text-[11px]">Preferences & Health Modes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your appearance theme, PCOS accommodations, apartment-friendly workouts, and notification schedules.
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* 1. Theme Selection */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Appearance & Theme
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light Mode', icon: Sun },
            { id: 'dark', label: 'Dark Mode', icon: Moon },
            { id: 'system', label: 'System Default', icon: Sparkles },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id as any)}
                className={`py-3 px-3 rounded-2xl text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                  theme === t.id
                    ? 'border-slate-900 bg-slate-900 text-white dark:border-rose-500 dark:bg-rose-600 dark:text-white shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-warm-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PCOS / PCOD Mode */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">PCOS / PCOD Support Mode</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-[10px] text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-semibold">
                Gentle Protocol
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Prioritizes low-cortisol exercise formats, steady resistance training, and low-glycemic, anti-inflammatory meal choices.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              checked={pcosMode}
              onChange={(e) => setPcosMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600" />
          </label>
        </div>
      </div>

      {/* 3. Quiet Friendly Workouts */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Quiet Mode Default</span>
              <span className="px-2 py-0.5 rounded-full bg-sapphire-100 text-[10px] text-sapphire-700 dark:bg-sapphire-950/60 dark:text-sapphire-300 font-semibold">
                No Jumping
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Automatically selects exercises without jumping or loud floor impacts, ideal for apartments or late-evening workouts.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              checked={quietMode}
              onChange={(e) => setQuietMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sapphire-600" />
          </label>
        </div>
      </div>

      {/* 4. Notification Preferences */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm mb-1">
          <Bell className="w-4 h-4 text-rose-500" />
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
          <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
            <input
              type="checkbox"
              checked={item.checked}
              onChange={(e) => item.setter(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-rose-500"
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={handleSave}
        disabled={isLoading}
        className="w-full shadow-sm py-3"
      >
        {isLoading ? 'Saving...' : 'Save Settings'}
      </Button>

      {/* Disclaimer */}
      <p className="text-[10px] text-slate-400 text-center leading-relaxed mt-4 max-w-xl mx-auto">
        {MEDICAL_DISCLAIMER}
      </p>
    </div>
  );
};
