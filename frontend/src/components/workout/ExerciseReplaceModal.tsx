import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Exercise } from '../../types';
import { api } from '../../api/client';
import { ArrowDown, ArrowUp, VolumeX, Shield, Check } from 'lucide-react';

interface ExerciseReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentExerciseId: string;
  onReplaced: (exercise: Exercise) => void;
}

const REASONS = [
  { id: 'easier', label: 'Easier Variation', desc: 'Step down the progression chain', icon: ArrowDown },
  { id: 'harder', label: 'Harder Challenge', desc: 'Step up the progression chain', icon: ArrowUp },
  { id: 'quiet', label: 'Quiet / No Jumping', desc: 'Apartment-friendly zero impact', icon: VolumeX },
  { id: 'low_impact', label: 'Knee & Joint Friendly', desc: 'Gentle on joints and wrists', icon: Shield },
];

export const ExerciseReplaceModal: React.FC<ExerciseReplaceModalProps> = ({
  isOpen,
  onClose,
  currentExerciseId,
  onReplaced,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectReason = async (reasonId: string) => {
    setIsLoading(true);
    try {
      const data = await api.replaceExercise(currentExerciseId, reasonId);
      if (data.replacement) {
        onReplaced(data.replacement);
        onClose();
      }
    } catch (err) {
      console.error('Failed to replace exercise', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Replace Exercise"
      subtitle="Select a reason to adapt this movement"
    >
      <div className="space-y-2.5 my-3">
        {REASONS.map((r) => {
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectReason(r.id)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-rose-300 dark:hover:border-rose-800 text-left transition-all group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                    {r.label}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{r.desc}</p>
                </div>
              </div>
              <Check className="w-4 h-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}
      </div>
    </Modal>
  );
};
