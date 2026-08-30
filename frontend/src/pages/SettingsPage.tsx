import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import {
  Settings,
  Bell,
  Sun,
  Moon,
  VolumeX,
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <Settings className="w-3.5 h-3.5" />
          <span>App Customization</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">
          Settings & Notifications
        </h1>
      </div>

      {isSaved && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300">
          Settings updated successfully!
        </div>
      )}

      {/* 1. Theme Selection (§12) */}
      <Card>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Visual Theme
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Choose light, dark, or sync automatically with your system settings.
        </p>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'light', label: 'Light Mode', icon: Sun },
            { id: 'dark', label: 'Dark Mode', icon: Moon },
            { id: 'system', label: 'System', icon: Settings },
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id as any)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4 mb-1.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 2. PCOS / PCOD Support Mode (§9) */}
      <Card className="border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Shield className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                PCOS / PCOD Support Mode
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Modifies workout volume toward consistent strength, mindful walks, and anti-inflammatory whole-food nutrition.
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
                {MEDICAL_DISCLAIMER}
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
      </Card>

      {/* 3. Quiet Workout Mode (§8.8) */}
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <VolumeX className="w-5 h-5 text-sapphire-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Default Quiet Workout Mode
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically prioritize zero-jumping, apartment-friendly workouts across all recommendations.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={quietMode}
            onChange={(e) => setQuietMode(e.target.checked)}
            className="w-5 h-5 rounded-md text-sapphire-600 focus:ring-sapphire-500 mt-1 cursor-pointer"
          />
        </div>
      </Card>

      {/* 4. Notification Preferences (§18) */}
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-slate-500" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Gentle Reminders
          </h4>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Each notification channel can be toggled independently without spam.
        </p>

        <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
          {[
            { label: 'Period & Phase Forecast Reminders', checked: notifyPeriod, set: setNotifyPeriod },
            { label: 'Daily 20s Check-in Prompt', checked: notifyCheckin, set: setNotifyCheckin },
            { label: 'Hydration Gentle Nudges', checked: notifyHydration, set: setNotifyHydration },
            { label: 'Workout Rhythm Reminders', checked: notifyWorkout, set: setNotifyWorkout },
            { label: 'Meal & Nutrition Timing Focus', checked: notifyNutrition, set: setNotifyNutrition },
            { label: 'Weekly Wellness Recap & Insights', checked: notifyInsights, set: setNotifyInsights },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between pt-2.5 text-xs">
              <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.set(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </Card>

      <Button
        variant="rose"
        size="lg"
        className="w-full"
        isLoading={isLoading}
        onClick={handleSave}
      >
        Save Settings
      </Button>
    </div>
  );
};
