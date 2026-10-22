import React, { useState } from 'react';
import { PhaseType } from '../../types';
import { CYCLE_SYNC_GUIDE, PHASE_CONFIG } from '../../constants';
import {
  Briefcase,
  Flame,
  UtensilsCrossed,
  Sparkles,
  Users,
  Copy,
  Check,
  ChevronRight,
  Shield,
  Heart,
} from 'lucide-react';

interface DailyLifeSyncForecastProps {
  phase: PhaseType;
  cycleDay: number;
}

export const DailyLifeSyncForecast: React.FC<DailyLifeSyncForecastProps> = ({
  phase,
  cycleDay,
}) => {
  const guide = CYCLE_SYNC_GUIDE[phase] || CYCLE_SYNC_GUIDE.Follicular;
  const config = PHASE_CONFIG[phase] || PHASE_CONFIG.Follicular;
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'work' | 'movement' | 'nutrition' | 'skin'>('work');

  const handleCopyBriefing = () => {
    const text = `🌸 Today's Bio-Rhythm Briefing (${phase} Phase - Day ${cycleDay}):
• Work & Focus: ${guide.workAndFocus}
• Movement: ${guide.movementPillar}
• Nutrition: ${guide.nutritionPillar}
• Social Energy: ${guide.socialEnergy}
• Seed Cycling: ${guide.seedCycling}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
              Daily Cycle-Sync Forecast
            </span>
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mt-0.5">
            Day {cycleDay} &bull; {phase} Phase Alignment
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {guide.hormoneProfile}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            Social Energy: {guide.socialEnergy}
          </span>
          <button
            onClick={handleCopyBriefing}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Copy briefing for partner or notes"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Pillar Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('work')}
          className={`p-3 rounded-2xl text-left border transition-all ${
            activeTab === 'work'
              ? 'border-slate-900 bg-slate-900 text-white dark:border-rose-500 dark:bg-rose-600 dark:text-white shadow-sm'
              : 'border-slate-200/80 dark:border-slate-800 bg-warm-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Work & Focus</span>
          </div>
          <span className={`text-[10px] line-clamp-1 ${activeTab === 'work' ? 'text-slate-300 dark:text-rose-100' : 'text-slate-400'}`}>
            Cognitive capacity
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('movement')}
          className={`p-3 rounded-2xl text-left border transition-all ${
            activeTab === 'movement'
              ? 'border-slate-900 bg-slate-900 text-white dark:border-rose-500 dark:bg-rose-600 dark:text-white shadow-sm'
              : 'border-slate-200/80 dark:border-slate-800 bg-warm-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Movement</span>
          </div>
          <span className={`text-[10px] line-clamp-1 ${activeTab === 'movement' ? 'text-slate-300 dark:text-rose-100' : 'text-slate-400'}`}>
            Cortisol & stamina
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('nutrition')}
          className={`p-3 rounded-2xl text-left border transition-all ${
            activeTab === 'nutrition'
              ? 'border-slate-900 bg-slate-900 text-white dark:border-rose-500 dark:bg-rose-600 dark:text-white shadow-sm'
              : 'border-slate-200/80 dark:border-slate-800 bg-warm-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Nourishment</span>
          </div>
          <span className={`text-[10px] line-clamp-1 ${activeTab === 'nutrition' ? 'text-slate-300 dark:text-rose-100' : 'text-slate-400'}`}>
            Cellular fuel
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skin')}
          className={`p-3 rounded-2xl text-left border transition-all ${
            activeTab === 'skin'
              ? 'border-slate-900 bg-slate-900 text-white dark:border-rose-500 dark:bg-rose-600 dark:text-white shadow-sm'
              : 'border-slate-200/80 dark:border-slate-800 bg-warm-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skin & Body</span>
          </div>
          <span className={`text-[10px] line-clamp-1 ${activeTab === 'skin' ? 'text-slate-300 dark:text-rose-100' : 'text-slate-400'}`}>
            Barrier & recovery
          </span>
        </button>
      </div>

      {/* Active Tab Content Panel */}
      <div className="p-4 rounded-2xl bg-warm-50/60 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
        {activeTab === 'work' && (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold">
              <span>Work, Meetings & Brainpower</span>
              <span className="text-[10px] text-slate-400">Professional Sync</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {guide.workAndFocus}
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5">
              {guide.recommendedActivities.map((act, i) => (
                <span key={i} className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-700 text-[11px] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
                  {act}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'movement' && (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold">
              <span>Exercise & Cortisol Rhythm</span>
              <span className="text-[10px] text-slate-400">Athletic Alignment</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {guide.movementPillar}
            </p>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold">
              <span>Metabolism & Hormonal Nourishment</span>
              <span className="text-[10px] text-slate-400">Culinary Sync</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {guide.nutritionPillar}
            </p>
            <div className="mt-2 p-2 rounded-xl bg-white dark:bg-slate-700 text-[11px] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 flex items-center gap-2">
              <span className="font-semibold text-rose-600 dark:text-rose-400">Seed Cycling:</span>
              <span>{guide.seedCycling}</span>
            </div>
          </div>
        )}

        {activeTab === 'skin' && (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold">
              <span>Dermatological Care & Recovery Signals</span>
              <span className="text-[10px] text-slate-400">Skin Barrier</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {guide.skinAndBody}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
