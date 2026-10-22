import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { PhaseInfo, DailyCheckin, Workout, RecommendedMeal } from '../types';
import { UniverseHub } from '../components/universe/UniverseHub';
import { PeriodLoggerModal } from '../components/cycle/PeriodLoggerModal';
import { CompanionDrawer } from '../components/companion/CompanionDrawer';
import { Skeleton } from '../components/common/Skeleton';

export const UniversePage: React.FC = () => {
  const { profile } = useAuth();
  const [phaseInfo, setPhaseInfo] = useState<PhaseInfo | null>(null);
  const [todayCheckin, setTodayCheckin] = useState<DailyCheckin | null>(null);
  const [recommendedWorkout, setRecommendedWorkout] = useState<Workout | null>(null);
  const [todayMeals, setTodayMeals] = useState<RecommendedMeal[]>([]);
  const [waterML, setWaterML] = useState<number>(1500);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPeriodLoggerOpen, setIsPeriodLoggerOpen] = useState<boolean>(false);
  const [isCompanionOpen, setIsCompanionOpen] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const cycleData = await api.getCurrentCycle().catch(() => null);
      if (cycleData?.phase_info) setPhaseInfo(cycleData.phase_info);

      const checkinData = await api.getTodayCheckin().catch(() => null);
      if (checkinData?.checkin) {
        setTodayCheckin(checkinData.checkin);
        setWaterML(checkinData.checkin.water_ml || 1500);
      }

      const recData = await api.getRecommendedWorkout().catch(() => null);
      if (recData?.workout) setRecommendedWorkout(recData.workout);

      const nutData = await api.getTodayNutrition().catch(() => null);
      if (nutData?.meals) setTodayMeals(nutData.meals);
    } catch (e) {
      console.warn('Universe load notice', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddWater = async (amount: number) => {
    const nextVal = waterML + amount;
    setWaterML(nextVal);
    try {
      await api.saveCheckin({
        water_ml: nextVal,
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Harmonizing Personal Universe...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <UniverseHub
        userName={profile?.name || 'Voyager'}
        phaseInfo={phaseInfo}
        checkin={todayCheckin}
        recommendedWorkout={recommendedWorkout}
        todayMeals={todayMeals}
        waterML={waterML}
        onAddWater={handleAddWater}
        onOpenCompanion={() => setIsCompanionOpen(true)}
        onOpenPeriodLogger={() => setIsPeriodLoggerOpen(true)}
      />

      <PeriodLoggerModal
        isOpen={isPeriodLoggerOpen}
        onClose={() => setIsPeriodLoggerOpen(false)}
        onSuccess={loadData}
      />

      <CompanionDrawer
        isOpen={isCompanionOpen}
        onClose={() => setIsCompanionOpen(false)}
        context={{
          userName: profile?.name || 'Voyager',
          phase: phaseInfo?.current_phase || 'Follicular',
          cycleDay: phaseInfo?.cycle_day || 9,
          hydrationML: waterML,
        }}
      />
    </div>
  );
};
