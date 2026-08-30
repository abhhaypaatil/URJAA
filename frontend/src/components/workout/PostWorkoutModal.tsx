import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Sparkles, Trophy, Clock, CheckCircle2 } from 'lucide-react';
import { MEDICAL_DISCLAIMER } from '../../constants';

interface PostWorkoutModalProps {
  isOpen: boolean;
  durationSeconds: number;
  exercisesCompleted: number;
  onSubmitEffort: (effort: 'Too easy' | 'Good' | 'Hard') => void;
}

export const PostWorkoutModal: React.FC<PostWorkoutModalProps> = ({
  isOpen,
  durationSeconds,
  exercisesCompleted,
  onSubmitEffort,
}) => {
  const [selectedEffort, setSelectedEffort] = useState<'Too easy' | 'Good' | 'Hard' | null>(null);

  const durationMin = Math.max(1, Math.round(durationSeconds / 60));

  const options: Array<{ id: 'Too easy' | 'Good' | 'Hard'; label: string; desc: string }> = [
    { id: 'Too easy', label: 'Too Easy', desc: 'Slightly increase volume next time (+10%)' },
    { id: 'Good', label: 'Felt Great', desc: 'Just right — keep steady progression' },
    { id: 'Hard', label: 'Challenging', desc: 'Adjust next session toward gentler recovery' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Workout Complete!" maxWidth="md">
      <div className="flex flex-col items-center text-center py-2">
        <div className="w-14 h-14 rounded-3xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 shadow-rose-glow">
          <Trophy className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Movement Logged!
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          You honored your body's energy today.
        </p>

        {/* Stats summary */}
        <div className="grid grid-cols-2 gap-3 w-full my-4">
          <div className="p-3 rounded-2xl bg-warm-100 dark:bg-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Duration</span>
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {durationMin} mins
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-warm-100 dark:bg-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {exercisesCompleted} exercises
            </span>
          </div>
        </div>

        {/* Perceived Effort Question (§8.10/8.11) */}
        <div className="w-full text-left my-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            How did today's session feel?
          </label>
          <div className="space-y-2">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedEffort(opt.id)}
                className={`w-full p-3 rounded-2xl border text-left transition-all ${
                  selectedEffort === opt.id
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${selectedEffort === opt.id ? 'text-rose-700 dark:text-rose-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {opt.label}
                  </span>
                  {selectedEffort === opt.id && <Sparkles className="w-4 h-4 text-rose-500" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-slate-400 dark:text-slate-500 my-2 leading-relaxed">
          {MEDICAL_DISCLAIMER}
        </p>

        <Button
          variant="rose"
          className="w-full mt-2"
          disabled={!selectedEffort}
          onClick={() => selectedEffort && onSubmitEffort(selectedEffort)}
        >
          Save & Return to Dashboard
        </Button>
      </div>
    </Modal>
  );
};
