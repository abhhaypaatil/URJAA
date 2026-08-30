import React from 'react';
import { Clock, Play, VolumeX, Shield, Sparkles } from 'lucide-react';
import { Workout } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface WorkoutCardProps {
  workout: Workout;
  onStart: () => void;
  isRecommended?: boolean;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onStart,
  isRecommended = false,
}) => {
  return (
    <Card
      className={`relative overflow-hidden transition-all ${
        isRecommended
          ? 'border-rose-300 dark:border-rose-800/80 bg-gradient-to-br from-rose-50/70 via-white to-warm-50 dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-900 shadow-rose-glow'
          : 'hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {isRecommended && (
        <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Recommended For Today</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            {workout.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
            {workout.description}
          </p>
        </div>
      </div>

      {/* Badges & Meta */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        <Badge size="sm" variant="rose">
          {workout.category}
        </Badge>
        <Badge size="sm" variant="neutral">
          {workout.intensity}
        </Badge>
        {workout.is_quiet && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <VolumeX className="w-2.5 h-2.5" />
            Quiet
          </span>
        )}
        {workout.is_low_impact && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Shield className="w-2.5 h-2.5" />
            Low Impact
          </span>
        )}
      </div>

      {/* Card Action */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{workout.estimated_duration_min} mins</span>
        </div>

        <Button
          size="sm"
          variant={isRecommended ? 'rose' : 'primary'}
          leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          onClick={onStart}
        >
          Start Session
        </Button>
      </div>
    </Card>
  );
};
