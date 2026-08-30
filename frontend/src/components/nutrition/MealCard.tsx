import React from 'react';
import { Clock, CheckCircle2, Circle, ArrowLeftRight, Sparkles } from 'lucide-react';
import { Meal } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface MealCardProps {
  meal: Meal;
  completed: boolean;
  onToggleComplete: () => void;
  onOpenSubstitute: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  completed,
  onToggleComplete,
  onOpenSubstitute,
}) => {
  return (
    <Card
      className={`transition-all ${
        completed
          ? 'border-sage-300 dark:border-sage-800 bg-sage-50/40 dark:bg-sage-950/20'
          : 'hover:border-rose-200 dark:hover:border-rose-900/60'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              {meal.meal_type}
            </span>
            <Badge size="sm" variant="outline">
              {meal.dietary_preference}
            </Badge>
          </div>
          <h4
            className={`text-base font-semibold text-slate-900 dark:text-white ${
              completed ? 'line-through text-slate-500 dark:text-slate-400' : ''
            }`}
          >
            {meal.title}
          </h4>
        </div>

        <button
          type="button"
          onClick={onToggleComplete}
          className="p-1 text-slate-400 hover:text-sage-600 transition-colors"
          title={completed ? 'Mark as not completed' : 'Mark as completed'}
        >
          {completed ? (
            <CheckCircle2 className="w-6 h-6 text-sage-600 dark:text-sage-400 fill-sage-100 dark:fill-sage-950/80" />
          ) : (
            <Circle className="w-6 h-6 text-slate-300 dark:text-slate-700 hover:text-rose-500" />
          )}
        </button>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
        {meal.description}
      </p>

      {/* Key Nutrients */}
      {meal.key_nutrients && meal.key_nutrients.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {meal.key_nutrients.map((nut) => (
            <span
              key={nut}
              className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-warm-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <Sparkles className="w-2.5 h-2.5 text-rose-500" />
              {nut}
            </span>
          ))}
        </div>
      )}

      {/* Card Footer: Prep time & Replace button */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{meal.prep_time_min} mins prep</span>
        </div>

        <button
          type="button"
          onClick={onOpenSubstitute}
          className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:text-rose-700 font-medium text-xs hover:underline"
        >
          <ArrowLeftRight className="w-3 h-3" />
          <span>Replace</span>
        </button>
      </div>
    </Card>
  );
};
