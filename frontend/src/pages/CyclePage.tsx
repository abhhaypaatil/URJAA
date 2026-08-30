import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { PhaseInfo, CycleSettings, CycleRecord } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { PhaseBadge } from '../components/cycle/PhaseBadge';
import { PeriodLoggerModal } from '../components/cycle/PeriodLoggerModal';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  Heart,
  Calendar as CalendarIcon,
  Sparkles,
  ShieldAlert,
  Activity,
  Plus,
  Clock,
} from 'lucide-react';
import { PHASE_CONFIG, MEDICAL_DISCLAIMER } from '../constants';

export const CyclePage: React.FC = () => {
  const [phaseInfo, setPhaseInfo] = useState<PhaseInfo | null>(null);
  const [settings, setCycleSettings] = useState<CycleSettings | null>(null);
  const [history, setHistory] = useState<CycleRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isLoggerOpen, setIsLoggerOpen] = useState<boolean>(false);

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
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadCycleData} />;
  }

  const allPhases = ['Menstrual', 'Follicular', 'Ovulatory', 'Luteal'] as const;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <Heart className="w-3.5 h-3.5" />
            <span>Cycle Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">
            Menstrual Rhythm
          </h1>
        </div>

        <Button
          variant="rose"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsLoggerOpen(true)}
        >
          Log Period Start / End
        </Button>
      </div>

      {/* Main Status Hero Card */}
      {phaseInfo && (
        <Card variant="gradient" className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <PhaseBadge
                  phase={phaseInfo.current_phase}
                  confidenceLabel={phaseInfo.confidence_label}
                />
                {phaseInfo.is_irregular && (
                  <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                    Irregular Rhythm
                  </span>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white">
                Cycle Day {phaseInfo.cycle_day}
              </h2>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-xl leading-relaxed">
                {phaseInfo.phase_description}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Est. Ovulation</span>
                <span className="block text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Day {phaseInfo.estimated_ovulation_day}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Next Period</span>
                <span className="block text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  in ~{phaseInfo.days_until_next_period}d
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <Activity className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Energy Trend: </span>
                <span className="text-slate-600 dark:text-slate-400">{phaseInfo.energy_trend}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Recommended Focus: </span>
                <span className="text-slate-600 dark:text-slate-400">{phaseInfo.recommended_focus}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 4 Phases Visual Timeline Guide */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
          The 4 Cycle Phases
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {allPhases.map((p) => {
            const pConf = PHASE_CONFIG[p];
            const isCurrent = phaseInfo?.current_phase === p;
            return (
              <Card
                key={p}
                className={`p-4 transition-all ${
                  isCurrent
                    ? 'border-rose-400 dark:border-rose-700 bg-rose-50/40 dark:bg-rose-950/20 shadow-sm'
                    : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${pConf.textColor}`}>
                    {p}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {pConf.summary}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Historical Cycles List */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Logged Cycle History
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            Average: {settings?.avg_cycle_length || 28} days
          </span>
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
            No historical period logs recorded yet. Tap "Log Period Start" when your cycle begins.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {history.map((h, i) => (
              <div key={h.id || i} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Cycle Started: {h.start_date}
                  </span>
                  {h.notes && <p className="text-[11px] text-slate-400 mt-0.5">{h.notes}</p>}
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {h.cycle_length ? `${h.cycle_length} days` : 'In progress'}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {h.period_duration} days flow
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <PeriodLoggerModal
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        onSuccess={loadCycleData}
      />
    </div>
  );
};
