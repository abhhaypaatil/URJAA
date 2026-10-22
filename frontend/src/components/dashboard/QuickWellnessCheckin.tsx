import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { DailyCheckin } from '../../types';
import { api } from '../../api/client';
import { Smile, BatteryCharging, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface QuickWellnessCheckinProps {
  currentCheckin: DailyCheckin | null;
  onCheckinSaved: (checkin: DailyCheckin) => void;
}

const MOOD_OPTIONS = [
  { value: 'Great', label: 'Great', emoji: '✨' },
  { value: 'Good', label: 'Good', emoji: '😊' },
  { value: 'Okay', label: 'Okay', emoji: '🌿' },
  { value: 'Low', label: 'Low', emoji: '☁️' },
  { value: 'Bad', label: 'Rough', emoji: '🌧️' },
];

const ENERGY_OPTIONS = [
  { value: 'High', label: 'High', desc: 'Ready to move', color: 'text-rose-600 dark:text-rose-400' },
  { value: 'Medium', label: 'Steady', desc: 'Balanced stamina', color: 'text-amber-600 dark:text-amber-400' },
  { value: 'Low', label: 'Gentle', desc: 'Rest & restorative', color: 'text-skyblue-600 dark:text-skyblue-400' },
];

export const QuickWellnessCheckin: React.FC<QuickWellnessCheckinProps> = ({
  currentCheckin,
  onCheckinSaved,
}) => {
  const [selectedMood, setSelectedMood] = useState<string>(currentCheckin?.mood || '');
  const [selectedEnergy, setSelectedEnergy] = useState<string>(currentCheckin?.energy || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (moodToSave?: string, energyToSave?: string) => {
    const mood = moodToSave !== undefined ? moodToSave : selectedMood;
    const energy = energyToSave !== undefined ? energyToSave : selectedEnergy;

    if (!mood && !energy) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const today = new Date().toISOString().split('T')[0];
      const payload: Partial<DailyCheckin> = {
        date: today,
        mood: mood || undefined,
        energy: energy || undefined,
        water_ml: currentCheckin?.water_ml || 1200,
      };

      const res = await api.saveCheckin(payload);
      if (res.checkin) {
        onCheckinSaved(res.checkin);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save quick check-in:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectMood = (mood: string) => {
    setSelectedMood(mood);
    handleSave(mood, undefined);
  };

  const handleSelectEnergy = (energy: string) => {
    setSelectedEnergy(energy);
    handleSave(undefined, energy);
  };

  return (
    <Card
      variant="default"
      className="p-5 md:p-6 bg-white dark:bg-slate-900 border-plum-100/70 dark:border-slate-800 shadow-soft space-y-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blush-100 dark:bg-rose-950/60 flex items-center justify-center text-blush-600 dark:text-rose-400">
            <Smile className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-plum-950 dark:text-white leading-tight">
              20-Second Wellness Pulse
            </h3>
            <p className="text-xs text-plum-600 dark:text-slate-400">
              How are you feeling right now? Tap any indicator to check in.
            </p>
          </div>
        </div>

        {saveSuccess ? (
          <Badge variant="pistachio" size="sm">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            <span>Saved</span>
          </Badge>
        ) : (
          <span className="text-[11px] font-medium text-plum-500 dark:text-slate-400 hidden sm:inline">
            Always optional • Change anytime
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {/* Mood Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-plum-800 dark:text-slate-200 flex items-center justify-between">
            <span>Mood Atmosphere</span>
            {selectedMood && (
              <span className="text-[11px] font-normal text-blush-600 dark:text-blush-400 font-medium">
                Selected: {selectedMood}
              </span>
            )}
          </label>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {MOOD_OPTIONS.map((opt) => {
              const isSelected = selectedMood === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectMood(opt.value)}
                  className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all text-center select-none active:scale-95 focus:outline-none focus:ring-2 focus:ring-blush-400 ${
                    isSelected
                      ? 'border-blush-400 bg-blush-50 text-plum-950 font-bold shadow-subtle dark:bg-rose-950/60 dark:border-rose-700 dark:text-white'
                      : 'border-plum-100/70 bg-ivory-50/70 text-plum-700 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`Mood: ${opt.label}`}
                >
                  <span className="text-xl mb-1">{opt.emoji}</span>
                  <span className="text-[11px] leading-tight">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy Level Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-plum-800 dark:text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <BatteryCharging className="w-3.5 h-3.5 text-pistachio-600" />
              <span>Energy Stamina</span>
            </span>
            {selectedEnergy && (
              <span className="text-[11px] font-normal text-pistachio-700 dark:text-emerald-400 font-medium">
                Selected: {selectedEnergy}
              </span>
            )}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ENERGY_OPTIONS.map((opt) => {
              const isSelected = selectedEnergy === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectEnergy(opt.value)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all text-center select-none active:scale-95 focus:outline-none focus:ring-2 focus:ring-pistachio-400 ${
                    isSelected
                      ? 'border-pistachio-400 bg-pistachio-50 text-plum-950 font-bold shadow-subtle dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-white'
                      : 'border-plum-100/70 bg-ivory-50/70 text-plum-700 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`Energy level: ${opt.label}`}
                >
                  <span className="text-xs font-bold">{opt.label}</span>
                  <span className="text-[10px] text-plum-500 dark:text-slate-400 mt-0.5">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};
