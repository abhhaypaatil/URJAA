import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { IllustratedExerciseAvatar } from './IllustratedExerciseAvatar';
import { CloudinaryMedia } from '../media/CloudinaryMedia';
import { getMediaForExercise } from '../../constants/mediaManifest';
import { Exercise } from '../../types';
import {
  Play,
  Pause,
  Shield,
  Clock,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react';

interface ExerciseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  onCompleteExercise?: (exerciseId: string) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  isOpen,
  onClose,
  exercise,
  onCompleteExercise,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  if (!exercise) return null;

  // Cloudinary media manifest lookup
  const mediaEntry = getMediaForExercise(exercise.id, exercise.name, exercise.category);

  const handleComplete = () => {
    setHasCompleted(true);
    if (onCompleteExercise) {
      onCompleteExercise(exercise.id);
    }
    setTimeout(() => {
      onClose();
      setHasCompleted(false);
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={exercise.name}
      subtitle={`${exercise.category} • ${exercise.difficulty} • ${exercise.equipment || 'No equipment'}`}
      maxWidth="lg"
    >
      <div className="space-y-5 py-2">
        {/* Visual Demonstration: Illustrated Human Avatar or Cloudinary Video */}
        <div className="relative">
          {mediaEntry?.publicId && mediaEntry.mediaType === 'video' ? (
            <div className="rounded-3xl overflow-hidden border border-plum-100 dark:border-slate-800">
              <CloudinaryMedia
                assetKey={mediaEntry.assetKey}
                aspectRatio="16:9"
                title={exercise.name}
                customFallback={
                  <IllustratedExerciseAvatar
                    movementType={exercise.animation_type}
                    exerciseName={exercise.name}
                    isPlaying={isPlaying}
                    isModified={isModified}
                  />
                }
              />
            </div>
          ) : (
            <IllustratedExerciseAvatar
              movementType={exercise.animation_type}
              exerciseName={exercise.name}
              isPlaying={isPlaying}
              isModified={isModified}
            />
          )}

          {/* Interactive Play/Pause & Modification Controls */}
          <div className="flex items-center justify-between mt-2.5 px-1">
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-urjaa-plum dark:text-slate-300 hover:text-urjaa-rose transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Movement' : 'Play Movement'}</span>
            </button>

            {/* Beginner / Low-Impact Modification Toggle */}
            <button
              type="button"
              onClick={() => setIsModified((prev) => !prev)}
              className={`text-xs font-semibold px-3 py-1 rounded-xl border transition-all ${
                isModified
                  ? 'bg-urjaa-blush text-urjaa-plum border-urjaa-rose shadow-subtle'
                  : 'bg-white dark:bg-slate-800 text-plum-600 border-plum-200 dark:border-slate-700'
              }`}
            >
              {isModified ? 'Showing: Low-Impact Modification' : 'View Beginner Modification'}
            </button>
          </div>
        </div>

        {/* Prescription Guidance */}
        <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-urjaa-ivory/80 dark:bg-slate-800/60 border border-plum-100 dark:border-slate-700 text-center">
          <div>
            <span className="text-[10px] font-semibold text-plum-500 uppercase tracking-wider block">Target</span>
            <span className="text-sm font-bold text-plum-950 dark:text-white">
              {exercise.type === 'reps'
                ? `${exercise.default_reps} Reps`
                : `${exercise.default_duration_seconds}s`}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-plum-500 uppercase tracking-wider block">Rest Guidance</span>
            <span className="text-sm font-bold text-plum-950 dark:text-white">
              {exercise.rest_seconds || 20}s Rest
            </span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-plum-500 uppercase tracking-wider block">Impact Format</span>
            <span className="text-sm font-bold text-plum-950 dark:text-white">
              {exercise.low_impact ? 'Low Impact' : 'Moderate'}
            </span>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-2">
            Step-by-Step Biomechanics
          </h4>
          <ol className="space-y-1.5 list-decimal list-inside text-xs text-plum-800 dark:text-slate-200">
            {exercise.instructions?.map((step, i) => (
              <li key={i} className="leading-relaxed">
                <span className="font-medium">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Form Cues & Common Mistakes */}
        {exercise.common_mistakes && exercise.common_mistakes.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-urjaa-peach/30 dark:bg-amber-950/20 border border-urjaa-peach/60 dark:border-amber-900/40">
            <h5 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Form Cues & Common Mistakes to Avoid</span>
            </h5>
            <ul className="list-disc list-inside space-y-1 text-xs text-amber-950 dark:text-amber-200">
              {exercise.common_mistakes.map((mistake, idx) => (
                <li key={idx}>{mistake}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Muscle Focus & Equipment */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-semibold text-plum-500 mr-1">Muscles:</span>
          {exercise.muscle_groups?.map((m) => (
            <Badge key={m} variant="neutral" size="sm">
              {m}
            </Badge>
          ))}
          {exercise.quiet_friendly && (
            <Badge variant="pistachio" size="sm">
              Apartment Friendly
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2 flex gap-3">
          <Button variant="outline" className="w-1/3" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="blush"
            className="w-2/3 shadow-soft font-semibold"
            onClick={handleComplete}
            disabled={hasCompleted}
            leftIcon={
              hasCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Sparkles className="w-4 h-4 text-urjaa-rose" />
              )
            }
          >
            {hasCompleted ? 'Completed! (+80 XP)' : 'Log Exercise Done (+80 XP)'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
