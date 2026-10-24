import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Quest } from '../../services/gamificationService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CloudinaryMedia } from '../media/CloudinaryMedia';
import { CheckCircle2, Sparkles, ArrowRight, Compass, Play } from 'lucide-react';

interface DailyQuestsSectionProps {
  quests: Quest[];
  onCompleteQuest: (questId: string) => void;
  onOpenExercise?: (quest: Quest) => void;
}

export const DailyQuestsSection: React.FC<DailyQuestsSectionProps> = ({
  quests,
  onCompleteQuest,
  onOpenExercise,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blush-100 dark:bg-rose-950/60 flex items-center justify-center text-blush-600 dark:text-rose-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-plum-950 dark:text-white leading-tight">
              Today's Wellness Quests
            </h3>
            <p className="text-xs text-plum-600 dark:text-slate-400">
              Gentle, achievable rhythms to nurture your body and mind today.
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-blush-600 dark:text-rose-400 hidden sm:inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Refreshes Daily</span>
        </span>
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quests.map((quest) => {
          const isMovement = quest.category === 'movement' || quest.id === 'quest-movement';
          return (
            <Card
              key={quest.id}
              variant="default"
              className={`transition-all duration-200 flex flex-col justify-between overflow-hidden p-4 md:p-5 ${
                quest.completed
                  ? 'border-pistachio-300 dark:border-emerald-800 bg-pistachio-50/30 dark:bg-emerald-950/20'
                  : 'hover:border-blush-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                {/* Media Preview via Cloudinary or Clickable Demo trigger */}
                <div
                  onClick={() => {
                    if (isMovement && onOpenExercise) {
                      onOpenExercise(quest);
                    }
                  }}
                  className={`mb-3.5 rounded-2xl overflow-hidden border border-plum-100/60 dark:border-slate-800/80 relative group ${
                    isMovement && onOpenExercise ? 'cursor-pointer' : ''
                  }`}
                  title={isMovement ? 'Click to view avatar movement demonstration' : undefined}
                >
                  <CloudinaryMedia
                    assetKey={quest.assetKey}
                    aspectRatio="16:9"
                    containerClassName="max-h-36"
                  />
                  {isMovement && onOpenExercise && (
                    <div className="absolute inset-0 bg-plum-950/25 group-hover:bg-plum-950/40 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-blush-600 group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 ml-0.5 fill-blush-600" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Title & XP Badge */}
                <div className="flex items-start justify-between gap-2">
                  <h4
                    className={`text-base font-bold text-plum-950 dark:text-white leading-snug ${
                      quest.completed ? 'line-through text-plum-400 dark:text-slate-400' : ''
                    }`}
                  >
                    {quest.title}
                  </h4>

                  <Badge
                    variant={quest.completed ? 'pistachio' : 'blush'}
                    size="sm"
                    className="shrink-0"
                  >
                    +{quest.xpReward} XP
                  </Badge>
                </div>

                <p className="text-xs text-plum-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {quest.description}
                </p>
              </div>

              {/* Quest Action Footer */}
              <div className="mt-4 pt-3 border-t border-plum-100/60 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-plum-500 dark:text-slate-400 capitalize">
                  {quest.category} Focus
                </span>

                {quest.completed ? (
                  <div className="flex items-center gap-2">
                    {isMovement && onOpenExercise && (
                      <button
                        type="button"
                        onClick={() => onOpenExercise(quest)}
                        className="text-[11px] font-semibold text-plum-600 dark:text-slate-400 hover:text-blush-600 dark:hover:text-rose-400 inline-flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Replay</span>
                      </button>
                    )}
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pistachio-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 fill-pistachio-100 dark:fill-emerald-950" />
                      <span>Completed</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {isMovement && onOpenExercise ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onOpenExercise(quest)}
                        className="text-xs px-2.5 py-1"
                      >
                        <Play className="w-3 h-3 mr-1 text-blush-600" />
                        <span>Demo</span>
                      </Button>
                    ) : quest.actionRoute ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(quest.actionRoute!)}
                        className="text-xs px-2.5 py-1 text-plum-700 dark:text-slate-300"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="blush"
                      onClick={() => onCompleteQuest(quest.id)}
                      className="text-xs px-3 py-1"
                    >
                      Complete
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
