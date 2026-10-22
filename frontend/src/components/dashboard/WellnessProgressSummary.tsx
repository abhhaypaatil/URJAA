import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { GamificationState } from '../../services/gamificationService';
import { Sparkles, Award, Flame, TrendingUp } from 'lucide-react';

interface WellnessProgressSummaryProps {
  gamification: GamificationState;
  completedQuestsCount: number;
  totalQuestsCount: number;
  onViewAchievements?: () => void;
}

export const WellnessProgressSummary: React.FC<WellnessProgressSummaryProps> = ({
  gamification,
  completedQuestsCount,
  totalQuestsCount,
  onViewAchievements,
}) => {
  const progressPercent = Math.min(
    100,
    Math.round((gamification.currentXp / gamification.xpForNextLevel) * 100)
  );

  const unlockedCount = gamification.achievements?.filter((a) => a.unlocked).length || 0;

  return (
    <Card
      variant="default"
      className="p-5 md:p-6 bg-gradient-to-br from-white via-blush-50/20 to-ivory-50 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/20 border-plum-100/70 dark:border-slate-800 shadow-soft"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Level & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blush-500 to-rose-500 flex items-center justify-center text-white shadow-soft shrink-0">
            <Award className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blush-600 dark:text-rose-400">
                Wellness Rhythm
              </span>
              <span className="w-1 h-1 rounded-full bg-plum-300 dark:bg-slate-700" />
              <span className="text-xs font-semibold text-plum-600 dark:text-slate-400">
                Level {gamification.level}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-serif font-bold text-plum-950 dark:text-white mt-0.5">
              {gamification.levelTitle}
            </h3>
          </div>
        </div>

        {/* Streak, Badges & Quests Pill */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-pistachio-50 dark:bg-emerald-950/40 border border-pistachio-200/80 dark:border-emerald-900/60 text-xs font-semibold text-pistachio-900 dark:text-emerald-200">
            <Flame className="w-4 h-4 text-pistachio-600 dark:text-emerald-400 fill-current" />
            <span>{gamification.streakDays} Day Rhythm</span>
          </div>

          {onViewAchievements && (
            <button
              type="button"
              onClick={onViewAchievements}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-blush-50 dark:bg-rose-950/40 border border-blush-200/80 dark:border-rose-900/60 text-xs font-semibold text-blush-900 dark:text-rose-200 hover:bg-blush-100 transition-colors shadow-xs"
              title="View all earned achievements and milestones"
            >
              <Award className="w-4 h-4 text-blush-600 dark:text-rose-400" />
              <span>{unlockedCount} Badges</span>
            </button>
          )}

          <Badge variant="blush" size="md">
            {completedQuestsCount} / {totalQuestsCount} Quests Today
          </Badge>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mt-5 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium text-plum-700 dark:text-slate-300">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blush-500" />
            <span>Experience to Level {gamification.level + 1}</span>
          </span>
          <span className="font-mono text-[11px] text-plum-600 dark:text-slate-400">
            {gamification.currentXp} / {gamification.xpForNextLevel} XP
          </span>
        </div>

        {/* Bar */}
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Level XP progress"
          className="w-full h-3 rounded-full bg-ivory-200/80 dark:bg-slate-800 overflow-hidden p-0.5 border border-plum-100/50 dark:border-slate-700"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blush-500 via-rose-500 to-pistachio-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="text-[11px] text-plum-500 dark:text-slate-400 pt-0.5 flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-pistachio-600" />
          <span>Every habit logged adds to your lifetime wellness journey. No penalties, just steady momentum.</span>
        </p>
      </div>
    </Card>
  );
};
