import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { MoodSelector } from '../components/checkin/MoodSelector';
import { EnergySelector } from '../components/checkin/EnergySelector';
import { SymptomSelector } from '../components/checkin/SymptomSelector';
import { WaterTracker } from '../components/checkin/WaterTracker';
import { Button } from '../components/common/Button';
import {
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Activity,
  Heart,
  Droplets,
  Moon,
  Save,
  Zap,
} from 'lucide-react';

export const CheckinPage: React.FC = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bleedingStatus, setBleedingStatus] = useState<string>('no_bleeding');
  const [mood, setMood] = useState<string>('Good');
  const [energy, setEnergy] = useState<string>('High');
  const [cramps, setCramps] = useState<string>('None');
  const [bloating, setBloating] = useState<string>('None');
  const [sleep, setSleep] = useState<string>('Good');
  const [nutritionAdherence, setNutritionAdherence] = useState<string>('Followed');
  const [waterML, setWaterML] = useState<number>(1500);
  const [notes, setNotes] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    // Pre-load existing checkin for today if present
    api
      .getTodayCheckin()
      .then((data) => {
        if (data?.checkin) {
          const c = data.checkin;
          setBleedingStatus(c.bleeding_status || 'no_bleeding');
          if (c.mood) setMood(c.mood);
          if (c.energy) setEnergy(c.energy);
          if (c.cramps) setCramps(c.cramps);
          if (c.bloating) setBloating(c.bloating);
          if (c.sleep) setSleep(c.sleep);
          if (c.nutrition_adherence) setNutritionAdherence(c.nutrition_adherence);
          if (c.water_ml) setWaterML(c.water_ml);
          if (c.notes) setNotes(c.notes);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.saveCheckin({
        date,
        bleeding_status: bleedingStatus,
        mood,
        energy,
        cramps,
        bloating,
        sleep,
        nutrition_adherence: nutritionAdherence,
        water_ml: waterML,
        notes,
      });

      setIsSaved(true);
      setTimeout(() => {
        navigate('/home');
      }, 900);
    } catch (err) {
      console.error('Failed to save checkin', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Back to Today"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sapphire-600 dark:text-sapphire-400 uppercase tracking-wider font-mono">
            <Activity className="w-3.5 h-3.5" />
            <span>Daily Self Check-in</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">
            How are you feeling today?
          </h2>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
      </div>

      {isSaved ? (
        <div className="p-8 sm:p-10 rounded-3xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 text-center animate-in zoom-in-95 duration-300">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Check-in Saved!</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto">
            Your workout intensity, nutrition suggestions, and daily tips have adapted to your status.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          {/* Bleeding / Flow Status Pill Bar */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Bleeding & Period Flow</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'no_bleeding', label: 'No Bleeding' },
                { id: 'period_started', label: 'Period Started' },
                { id: 'period_continuing', label: 'Flowing' },
                { id: 'period_ended', label: 'Period Ended' },
              ].map((b) => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => setBleedingStatus(b.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                    bleedingStatus === b.id
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-warm-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <EnergySelector value={energy} onChange={setEnergy} />
          </div>

          {/* Mood Selector */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <MoodSelector value={mood} onChange={setMood} />
          </div>

          {/* Physical Sensations & Symptoms */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <SymptomSelector
              bleedingStatus={bleedingStatus}
              onBleedingChange={setBleedingStatus}
              cramps={cramps}
              onCrampsChange={setCramps}
              bloating={bloating}
              onBloatingChange={setBloating}
              sleep={sleep}
              onSleepChange={setSleep}
              nutritionAdherence={nutritionAdherence}
              onNutritionChange={setNutritionAdherence}
            />
          </div>

          {/* Hydration Tracker */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <WaterTracker
              waterML={waterML}
              targetML={2200}
              onAddWater={(amt) => setWaterML((prev) => prev + amt)}
              onSetWater={(tot) => setWaterML(tot)}
            />
          </div>

          {/* Mindful Daily Reflection & Notes */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Daily Mindful Reflection & Body Check
              </label>
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record a positive win, gratitude, or specific bodily sensations today..."
              className="w-full px-4 py-2.5 rounded-xl bg-warm-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full py-3 text-sm font-semibold shadow-sm"
              leftIcon={<Save className="w-4 h-4" />}
            >
              {isLoading ? 'Saving...' : 'Save Check-in'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
