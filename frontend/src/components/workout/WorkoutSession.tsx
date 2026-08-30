import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  ArrowLeftRight,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  Plus,
} from 'lucide-react';
import { Workout, WorkoutExercise, Exercise } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ExerciseAnimation } from './ExerciseAnimations';
import { ExerciseReplaceModal } from './ExerciseReplaceModal';
import { PostWorkoutModal } from './PostWorkoutModal';

export type SessionState = 'PREPARING' | 'EXERCISE' | 'REST' | 'COMPLETE';

interface WorkoutSessionProps {
  workout: Workout;
  onExit: () => void;
  onFinished: (durationSeconds: number, effort: 'Too easy' | 'Good' | 'Hard') => void;
}

export const WorkoutSession: React.FC<WorkoutSessionProps> = ({
  workout,
  onExit,
  onFinished,
}) => {
  const [exercisesList, setExercisesList] = useState<WorkoutExercise[]>(workout.exercises || []);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [sessionState, setSessionState] = useState<SessionState>('PREPARING');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Timers and Rep Counters
  const [prepSeconds, setPrepSeconds] = useState<number>(5);
  const [exerciseSecondsLeft, setExerciseSecondsLeft] = useState<number>(30);
  const [restSecondsLeft, setRestSecondsLeft] = useState<number>(20);
  const [currentRepsDone, setCurrentRepsDone] = useState<number>(0);
  const [totalWorkoutDuration, setTotalWorkoutDuration] = useState<number>(0);

  // Modals
  const [isReplaceOpen, setIsReplaceOpen] = useState<boolean>(false);
  const [isPostWorkoutOpen, setIsPostWorkoutOpen] = useState<boolean>(false);

  const currentItem = exercisesList[currentIndex];
  const currentEx = currentItem?.exercise;
  const isTimeMode = currentItem?.mode === 'time';
  const targetReps = currentItem?.target || 10;
  const targetSeconds = currentItem?.target_seconds || 30;

  // Initialize countdown on exercise change
  useEffect(() => {
    if (currentItem) {
      setExerciseSecondsLeft(currentItem.target_seconds || 30);
      setRestSecondsLeft(currentItem.rest_seconds || 20);
      setCurrentRepsDone(0);
    }
  }, [currentIndex, currentItem]);

  // Overall workout clock timer
  useEffect(() => {
    if (sessionState === 'COMPLETE' || isPaused) return;
    const interval = setInterval(() => {
      setTotalWorkoutDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionState, isPaused]);

  // State Machine Timer Logic
  useEffect(() => {
    if (isPaused) return;

    // 1. PREPARING STATE
    if (sessionState === 'PREPARING') {
      if (prepSeconds <= 0) {
        setSessionState('EXERCISE');
        return;
      }
      const timer = setTimeout(() => setPrepSeconds((s) => s - 1), 1000);
      return () => clearTimeout(timer);
    }

    // 2. EXERCISE STATE (Time Mode countdown)
    if (sessionState === 'EXERCISE' && isTimeMode) {
      if (exerciseSecondsLeft <= 0) {
        handleExerciseComplete();
        return;
      }
      const timer = setTimeout(() => setExerciseSecondsLeft((s) => s - 1), 1000);
      return () => clearTimeout(timer);
    }

    // 3. REST STATE
    if (sessionState === 'REST') {
      if (restSecondsLeft <= 0) {
        handleNextExercise();
        return;
      }
      const timer = setTimeout(() => setRestSecondsLeft((s) => s - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [sessionState, prepSeconds, exerciseSecondsLeft, restSecondsLeft, isPaused, isTimeMode]);

  const handleExerciseComplete = () => {
    if (currentIndex >= exercisesList.length - 1) {
      setSessionState('COMPLETE');
      setIsPostWorkoutOpen(true);
    } else {
      setSessionState('REST');
      setRestSecondsLeft(currentItem?.rest_seconds || 20);
    }
  };

  const handleNextExercise = () => {
    if (currentIndex < exercisesList.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSessionState('EXERCISE');
    } else {
      setSessionState('COMPLETE');
      setIsPostWorkoutOpen(true);
    }
  };

  const handlePreviousExercise = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setSessionState('EXERCISE');
    }
  };

  const handleSkipExercise = () => {
    handleNextExercise();
  };

  const handleAddRep = () => {
    const nextReps = currentRepsDone + 1;
    setCurrentRepsDone(nextReps);
    if (nextReps >= targetReps) {
      handleExerciseComplete();
    }
  };

  const handleExerciseReplaced = (newExercise: Exercise) => {
    const updated = [...exercisesList];
    updated[currentIndex] = {
      ...updated[currentIndex],
      exercise: newExercise,
      exercise_id: newExercise.id,
      mode: newExercise.type,
      target: newExercise.default_reps,
      target_seconds: newExercise.default_duration_seconds,
    };
    setExercisesList(updated);
    setExerciseSecondsLeft(newExercise.default_duration_seconds);
    setCurrentRepsDone(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Exit session"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
              {workout.title}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 inline-block">
              {sessionState === 'REST' ? 'Resting' : `Exercise ${currentIndex + 1} of ${exercisesList.length}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <Badge variant="rose" size="sm">
            {Math.floor(totalWorkoutDuration / 60)}:
            {String(totalWorkoutDuration % 60).padStart(2, '0')}
          </Badge>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto w-full">
        {/* PREPARING SCREEN */}
        {sessionState === 'PREPARING' && (
          <div className="flex flex-col items-center animate-fade-in">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-2">
              Get Ready
            </span>
            <div className="w-24 h-24 rounded-full bg-rose-50 dark:bg-rose-950/80 border-4 border-rose-500 flex items-center justify-center text-4xl font-extrabold text-rose-600 dark:text-rose-400 my-4 shadow-rose-glow">
              {prepSeconds}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {currentEx?.name || 'First Movement'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
              Take a deep breath and find your comfortable space.
            </p>
          </div>
        )}

        {/* ACTIVE EXERCISE SCREEN */}
        {sessionState === 'EXERCISE' && (
          <div className="flex flex-col items-center w-full">
            {/* SVG Looping Animation Archetype */}
            <div className="my-2 p-4 bg-warm-50/80 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner">
              <ExerciseAnimation
                type={currentEx?.animation_type || 'squat_pattern'}
                className="w-44 h-44"
                isPaused={isPaused}
              />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
              {currentEx?.name || 'Exercise'}
            </h2>

            {/* Target Display (Reps or Time) */}
            {isTimeMode ? (
              <div className="flex flex-col items-center my-3">
                <span className="text-5xl font-black text-rose-600 dark:text-rose-400 tracking-tight font-mono">
                  {exerciseSecondsLeft}s
                </span>
                <span className="text-xs text-slate-400 mt-1">Time Remaining</span>
              </div>
            ) : (
              <div className="flex flex-col items-center my-3">
                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                  {currentRepsDone} <span className="text-2xl text-slate-400">/ {targetReps}</span>
                </span>
                <span className="text-xs text-slate-400 mt-1">Reps Completed</span>
              </div>
            )}

            {/* Manual +1 Rep Button for Rep-based mode */}
            {!isTimeMode && (
              <button
                type="button"
                onClick={handleAddRep}
                className="my-2 px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-base shadow-soft flex items-center gap-2 transition-all"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
                <span>Count Rep (+1)</span>
              </button>
            )}

            {/* Replace Exercise Button */}
            <button
              type="button"
              onClick={() => setIsReplaceOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Replace movement (Easier / Harder / Quiet)</span>
            </button>
          </div>
        )}

        {/* REST SCREEN */}
        {sessionState === 'REST' && (
          <div className="flex flex-col items-center w-full animate-fade-in">
            <span className="text-xs font-bold uppercase tracking-widest text-sapphire-600 dark:text-sapphire-400 mb-1">
              Rest & Breathe
            </span>
            <div className="w-24 h-24 rounded-full bg-sapphire-50 dark:bg-sapphire-950/80 border-4 border-sapphire-500 flex items-center justify-center text-4xl font-extrabold text-sapphire-600 dark:text-sapphire-400 my-4 shadow-sapphire-glow">
              {restSecondsLeft}s
            </div>

            <button
              type="button"
              onClick={() => setRestSecondsLeft(0)}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all mb-6"
            >
              Skip Rest (+0s)
            </button>

            {/* Next Exercise Preview */}
            {currentIndex < exercisesList.length - 1 && (
              <div className="w-full p-4 rounded-2xl bg-warm-100/80 dark:bg-slate-900 border border-warm-200 dark:border-slate-800 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Next Exercise ({currentIndex + 2}/{exercisesList.length})
                </span>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                  {exercisesList[currentIndex + 1]?.exercise?.name || 'Next movement'}
                </h4>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Workout Controller */}
      <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={handlePreviousExercise}
            disabled={currentIndex === 0}
            className="p-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Previous exercise"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-4 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md hover:scale-105 active:scale-95 transition-all"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
          </button>

          <button
            type="button"
            onClick={handleSkipExercise}
            className="p-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="Next or Skip exercise"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Replace Exercise Modal */}
      <ExerciseReplaceModal
        isOpen={isReplaceOpen}
        onClose={() => setIsReplaceOpen(false)}
        currentExerciseId={currentEx?.id || ''}
        onReplaced={handleExerciseReplaced}
      />

      {/* Post Workout Rating Modal */}
      <PostWorkoutModal
        isOpen={isPostWorkoutOpen}
        durationSeconds={totalWorkoutDuration}
        exercisesCompleted={exercisesList.length}
        onSubmitEffort={(effort) => onFinished(totalWorkoutDuration, effort)}
      />
    </div>
  );
};
