import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { PhaseInfo, CycleSettings, CycleRecord, PhaseType } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { PhaseBadge } from '../components/cycle/PhaseBadge';
import { PeriodLoggerModal } from '../components/cycle/PeriodLoggerModal';
import { WeekAheadLifePlanner } from '../components/cycle/WeekAheadLifePlanner';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  Heart,
  Calendar as CalendarIcon,
  Sparkles,
  Activity,
  Plus,
  Clock,
  ChevronRight,
  TrendingUp,
  Info,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { PHASE_CONFIG } from '../constants';

const PHASE_GUIDES: Record<PhaseType, { days: string; workout: string; nutrition: string; hormone: string }> = {
  Menstrual: {
    days: 'Days 1–5',
    workout: 'Gentle stretching, restorative yin yoga, and slow walking.',
    nutrition: 'Iron-rich foods, warm soups, and hydrating herbal teas.',
    hormone: 'Estrogen and progesterone at their lowest baseline; resting state.',
  },
  Follicular: {
    days: 'Days 6–13',
    workout: 'Dynamic bodyweight, light resistance, and moderate tempo cardio.',
    nutrition: 'Cruciferous vegetables, sprouted grains, pumpkin seeds, and lean protein.',
    hormone: 'Rising estradiol and FSH; increasing physical stamina and focus.',
  },
  Ovulatory: {
    days: 'Days 14–16',
    workout: 'Peak strength training, bodyweight power flows, and interval movement.',
    nutrition: 'Antioxidant berries, leafy greens, sesame seeds, and ample hydration.',
    hormone: 'LH surge and estrogen peak; highest metabolic efficiency and energy.',
  },
  Luteal: {
    days: 'Days 17–28+',
    workout: 'Pilates, resistance band sculpting, walking, and low-cortisol circuits.',
    nutrition: 'Magnesium-dense foods, sweet potato, sunflower seeds, and complex carbs.',
    hormone: 'Progesterone dominant; body temperature slightly elevated, craving comfort.',
  },
};

export const CyclePage: React.FC = () => {
  const [phaseInfo, setPhaseInfo] = useState<PhaseInfo | null>(null);
  const [settings, setCycleSettings] = useState<CycleSettings | null>(null);
  const [history, setHistory] = useState<CycleRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isLoggerOpen, setIsLoggerOpen] = useState<boolean>(false);
  const [selectedPhaseDetail, setSelectedPhaseDetail] = useState<PhaseType | null>(null);

  const loadCycleData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentData = await api.getCurrentCycle();
      setPhaseInfo(currentData.phase_info);
      setCycleSettings(currentData.settings);

      const historyData = await api.getCycleHistory().catch(() => []);
      setHistory(historyData || []);
    } catch (err: any) {
      console.error('Failed to load cycle info', err);
      setError(err.message || 'Could not load cycle data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCycleData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-10 w-48 bg-warm-200 dark:bg-slate-800" />
        <Skeleton className="h-64 rounded-3xl bg-warm-200 dark:bg-slate-800" />
        <Skeleton className="h-48 rounded-3xl bg-warm-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadCycleData} />;
  }

  const allPhases: PhaseType[] = ['Menstrual', 'Follicular', 'Ovulatory', 'Luteal'];
  const activeDetailPhase = selectedPhaseDetail || phaseInfo?.current_phase || 'Menstrual';
  const detailConfig = PHASE_CONFIG[activeDetailPhase];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header - Soft feminine / wellness identity */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-rose-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
            <Heart className="w-4 h-4 fill-rose-500/20 text-rose-600 dark:text-rose-400" />
            <span className="uppercase tracking-wider font-mono text-[11px]">Hormonal Rhythm & Health</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
            Cycle Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Adaptive cycle tracking based on physiological hormone shifts, tuned to your individual variations rather than generic 28-day assumptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="rose"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsLoggerOpen(true)}
            className="shadow-sm"
          >
            Log Period
          </Button>
        </div>
      </div>

      {/* Main Cycle Hero Card */}
      {phaseInfo && (
        <div className="relative overflow-hidden rounded-3xl border border-rose-100 dark:border-rose-900/40 bg-gradient-to-br from-rose-50/70 via-white to-warm-50 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/20 p-6 sm:p-8 shadow-card">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <PhaseBadge
                  phase={phaseInfo.current_phase}
                  confidenceLabel={phaseInfo.confidence_label}
                />
                {phaseInfo.is_irregular && (
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    Irregular Cycle Mode
                  </span>
                )}
                <span className="text-[11px] text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {phaseInfo.confidence_score}% Confidence
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
                Day {phaseInfo.cycle_day} &bull; {phaseInfo.current_phase} Phase
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                {phaseInfo.phase_description}
              </p>
            </div>

            {/* Cycle Milestone Indicators */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-rose-100 dark:border-slate-700 text-center min-w-[130px] shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  Est. Ovulation
                </span>
                <span className="block text-xl font-bold text-slate-800 dark:text-white mt-1">
                  Day {phaseInfo.estimated_ovulation_day}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 block">
                  Fertile window
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-rose-100 dark:border-slate-700 text-center min-w-[130px] shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  Next Period
                </span>
                <span className="block text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                  ~{phaseInfo.days_until_next_period}d
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Estimated arrival
                </span>
              </div>
            </div>
          </div>

          {/* Phase Guidance Badges */}
          <div className="mt-6 pt-5 border-t border-rose-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-rose-100 dark:border-slate-700/80">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Energy & Stamina</span>
                <span className="text-slate-600 dark:text-slate-300 mt-0.5 block">{phaseInfo.energy_trend}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-rose-100 dark:border-slate-700/80">
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Suggested Focus</span>
                <span className="text-slate-600 dark:text-slate-300 mt-0.5 block">{phaseInfo.recommended_focus}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4 Hormonal Phases Explorer */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-white">
              The 4 Hormonal Phases
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tap any phase to explore recommended movement, nutrition, and hormonal biology.
            </p>
          </div>
          <span className="text-xs text-rose-600 dark:text-rose-400 font-medium hidden sm:inline">
            Active: {activeDetailPhase}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allPhases.map((p) => {
            const pConf = PHASE_CONFIG[p];
            const isCurrent = phaseInfo?.current_phase === p;
            const isSelected = activeDetailPhase === p;

            return (
              <button
                key={p}
                onClick={() => setSelectedPhaseDetail(p)}
                className={`p-4 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50/70 dark:bg-rose-950/30 dark:border-rose-500 shadow-sm ring-1 ring-rose-300 dark:ring-rose-800'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-200 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold ${pConf.textColor}`}>{p}</span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pConf.summary}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-[10px]">
                    {p === 'Menstrual' ? 'Low E & P' : p === 'Follicular' ? 'Rising E' : p === 'Ovulatory' ? 'LH & E Peak' : 'High Progesterone'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Phase Inspection Drawer Card */}
        {activeDetailPhase && (
          <div className="mt-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Detailed Guide: {activeDetailPhase} Phase
              </h4>
              <span className="text-xs text-slate-400">&bull; {PHASE_GUIDES[activeDetailPhase].days}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-3">
              <div className="p-3 rounded-xl bg-warm-50 dark:bg-slate-800/60 border border-warm-100 dark:border-slate-700">
                <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Workout Focus
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  {PHASE_GUIDES[activeDetailPhase].workout}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-warm-50 dark:bg-slate-800/60 border border-warm-100 dark:border-slate-700">
                <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Nutrition Support
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  {PHASE_GUIDES[activeDetailPhase].nutrition}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-warm-50 dark:bg-slate-800/60 border border-warm-100 dark:border-slate-700">
                <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Hormonal State
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  {PHASE_GUIDES[activeDetailPhase].hormone}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7-Day Life & Career Syncing Horizon (Professional Cycle-Planning) */}
      <WeekAheadLifePlanner
        currentCycleDay={phaseInfo?.cycle_day || 9}
        avgCycleLength={settings?.avg_cycle_length || 29}
      />

      {/* Cycle History Ledger */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <CalendarIcon className="w-4 h-4 text-rose-500" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Cycle History & Logs</h4>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Average length: {settings?.avg_cycle_length || 29} days
          </span>
        </div>

        {history.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No historical period logs recorded yet. Tap "Log Period" to record when your bleeding starts.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {history.map((h, i) => (
              <div key={h.id || i} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Cycle Started: {h.start_date}
                  </span>
                  {h.notes && <p className="text-[11px] text-slate-400 mt-0.5">{h.notes}</p>}
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {h.cycle_length ? `${h.cycle_length} days` : 'Current Cycle'}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {h.period_duration ? `${h.period_duration} days flow` : 'Flow recorded'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PeriodLoggerModal
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        onSuccess={loadCycleData}
      />
    </div>
  );
};
