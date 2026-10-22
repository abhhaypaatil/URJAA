import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Quest } from '../../services/gamificationService';
import { DailyCheckin } from '../../types';
import { CheckCircle2, Droplets, Activity, Flame, ArrowRight, Clock } from 'lucide-react';

interface RecentActivitySummaryProps {
  completedQuests: Quest[];
  todayCheckin: DailyCheckin | null;
  waterML: number;
}

export const RecentActivitySummary: React.FC<RecentActivitySummaryProps> = ({
  completedQuests,
  todayCheckin,
  waterML,
}) => {
  const activities: Array<{
    id: string;
    title: string;
    subtitle: string;
    time?: string;
    icon: React.ReactNode;
    badgeText?: string;
  }> = [];

  // 1. Water Activity
  if (waterML > 0) {
    activities.push({
      id: 'act-water',
      title: `${waterML} ml Hydration Recorded`,
      subtitle: 'Cellular replenishment logged today',
      icon: <Droplets className="w-4 h-4 text-skyblue-600 dark:text-skyblue-400" />,
      badgeText: 'Hydration',
    });
  }

  // 2. Checkin Activity
  if (todayCheckin?.mood || todayCheckin?.energy) {
    activities.push({
      id: 'act-checkin',
      title: 'Daily Wellness Pulse Recorded',
      subtitle: `${todayCheckin.mood ? `Mood: ${todayCheckin.mood}` : ''}${
        todayCheckin.mood && todayCheckin.energy ? ' • ' : ''
      }${todayCheckin.energy ? `Energy: ${todayCheckin.energy}` : ''}`,
      icon: <Activity className="w-4 h-4 text-blush-600 dark:text-rose-400" />,
      badgeText: 'Pulse',
    });
  }

  // 3. Completed Quests
  completedQuests.forEach((q) => {
    activities.push({
      id: `act-quest-${q.id}`,
      title: q.title,
      subtitle: `Completed • Earned +${q.xpReward} XP`,
      icon: <CheckCircle2 className="w-4 h-4 text-pistachio-600 dark:text-emerald-400" />,
      badgeText: 'Quest',
    });
  });

  return (
    <Card
      variant="default"
      className="p-5 md:p-6 bg-white dark:bg-slate-900 border-plum-100/70 dark:border-slate-800 shadow-soft space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-ivory-200/80 dark:bg-slate-800 flex items-center justify-center text-plum-700 dark:text-slate-300">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-plum-950 dark:text-white leading-tight">
              Today's Activity Log
            </h3>
            <p className="text-xs text-plum-600 dark:text-slate-400">
              Verified wellness actions logged during your active session.
            </p>
          </div>
        </div>

        <Link
          to="/calendar"
          className="text-xs font-semibold text-blush-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
        >
          <span>View History</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {activities.length === 0 ? (
        // Clean, helpful empty state
        <div className="py-8 text-center flex flex-col items-center justify-center space-y-3 bg-ivory-50/60 dark:bg-slate-900/40 rounded-2xl border border-dashed border-plum-200/70 dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-blush-50 dark:bg-rose-950/40 flex items-center justify-center text-blush-500">
            <Flame className="w-5 h-5" />
          </div>
          <div className="max-w-xs space-y-1">
            <h4 className="text-sm font-bold text-plum-950 dark:text-white">
              No Activities Logged Yet Today
            </h4>
            <p className="text-xs text-plum-600 dark:text-slate-400 leading-relaxed">
              Start your rhythm by completing a quest above or taking a 20-second pulse check-in.
            </p>
          </div>
          <Link to="/check-in">
            <Button size="sm" variant="blush" className="text-xs">
              Take 20s Check-in
            </Button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-plum-100/60 dark:divide-slate-800">
          {activities.map((act) => (
            <div key={act.id} className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-ivory-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-plum-100/50">
                  {act.icon}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-plum-950 dark:text-white">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-plum-500 dark:text-slate-400">{act.subtitle}</p>
                </div>
              </div>

              {act.badgeText && (
                <Badge variant="neutral" size="sm">
                  {act.badgeText}
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
