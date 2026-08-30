import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { MoodSelector } from '../components/checkin/MoodSelector';
import { EnergySelector } from '../components/checkin/EnergySelector';
import { SymptomSelector } from '../components/checkin/SymptomSelector';
import { WaterTracker } from '../components/checkin/WaterTracker';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';

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
  const [waterML, setWaterML] = useState<number>(1000);
  const [notes, setNotes] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    // Pre-load existing checkin for today if present
    api.getTodayCheckin().then((data) => {
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
    }).catch(() => {});
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
      }, 800);
    } catch (err) {
      console.error('Failed to save checkin', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/home')}
          className="p-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Daily Log</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Daily Check-in (~20s)
          </h2>
        </div>

        <div className="w-8" />
      </div>

      {isSaved ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-3 animate-bounce" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Check-in Saved!</h3>
          <p className="text-xs text-slate-500 mt-1">Adapting your daily nutrition and workouts...</p>
        </Card>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          {/* Mood Section */}
          <Card>
            <MoodSelector value={mood} onChange={setMood} />
          </Card>

          {/* Energy Section */}
          <Card>
            <EnergySelector value={energy} onChange={setEnergy} />
          </Card>

          {/* Symptoms & Bleeding Section */}
          <Card>
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
          </Card>

          {/* Hydration Section */}
          <Card>
            <WaterTracker
              waterML={waterML}
              targetML={2000}
              onAddWater={(amt) => setWaterML((w) => w + amt)}
              onSetWater={setWaterML}
            />
          </Card>

          {/* Optional Notes */}
          <Card>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Personal Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific sensations, cravings, or reflections..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-2xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </Card>

          <Button type="submit" variant="rose" size="lg" className="w-full" isLoading={isLoading}>
            Save Daily Check-in
          </Button>
        </form>
      )}
    </div>
  );
};
