import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Achievement } from '../../types';
import {
  Sparkles,
  Activity,
  Heart,
  Dumbbell,
  Flame,
  Compass,
  Award,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements?: Achievement[];
}

const getAchievementIcon = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles':
      return <Sparkles className="w-5 h-5 text-blush-600 dark:text-rose-400" />;
    case 'Activity':
      return <Activity className="w-5 h-5 text-skyblue-600 dark:text-sky-400" />;
    case 'Heart':
      return <Heart className="w-5 h-5 text-rose-500 dark:text-rose-400" />;
    case 'Dumbbell':
      return <Dumbbell className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    case 'Flame':
      return <Flame className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
    case 'Compass':
      return <Compass className="w-5 h-5 text-lavender-600 dark:text-purple-400" />;
    default:
      return <Award className="w-5 h-5 text-blush-600 dark:text-rose-400" />;
  }
};

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements = [],
}) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Wellness Milestones & Badges"
      subtitle={`${unlockedCount} of ${achievements.length} Badges Earned`}
      maxWidth="lg"
    >
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
        <p className="text-xs text-plum-600 dark:text-slate-400 leading-relaxed bg-blush-50/50 dark:bg-slate-800/50 p-3 rounded-2xl border border-plum-100/60 dark:border-slate-700/60">
          🌱 Every achievement is unlocked through genuine, persisted daily actions. No pressure, no streak penalties—just steady milestones along your personal rhythm.
        </p>

        <div className="grid grid-cols-1 gap-3">
          {achievements.map((ach) => {
            const percent = ach.max_progress > 0
              ? Math.min(100, Math.round((ach.progress / ach.max_progress) * 100))
              : 0;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  ach.unlocked
                    ? 'bg-pistachio-50/40 dark:bg-emerald-950/20 border-pistachio-300 dark:border-emerald-800/70 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-plum-100/70 dark:border-slate-800 opacity-80'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                    ach.unlocked
                      ? 'bg-pistachio-100 dark:bg-emerald-900/40 border-pistachio-300 dark:border-emerald-700'
                      : 'bg-ivory-100 dark:bg-slate-800 border-plum-100 dark:border-slate-700'
                  }`}
                >
                  {ach.unlocked ? (
                    getAchievementIcon(ach.icon)
                  ) : (
                    <Lock className="w-5 h-5 text-plum-400 dark:text-slate-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-plum-950 dark:text-white truncate">
                      {ach.title}
                    </h4>
                    {ach.unlocked ? (
                      <Badge variant="pistachio" size="sm">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        <span>Unlocked</span>
                      </Badge>
                    ) : (
                      <span className="text-[11px] font-mono text-plum-500 dark:text-slate-400">
                        {ach.progress} / {ach.max_progress}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-plum-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {ach.description}
                  </p>

                  {!ach.unlocked && ach.max_progress > 1 && (
                    <div className="mt-2 w-full h-1.5 rounded-full bg-ivory-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-blush-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
