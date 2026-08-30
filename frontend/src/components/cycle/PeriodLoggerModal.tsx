import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { api } from '../../api/client';
import { Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

interface PeriodLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PeriodLoggerModal: React.FC<PeriodLoggerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [actionType, setActionType] = useState<'start' | 'end'>('start');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (actionType === 'start') {
        await api.logPeriodStart({ start_date: date, notes });
      } else {
        await api.logPeriodEnd({ end_date: date });
      }
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess();
        onClose();
      }, 900);
    } catch (err) {
      console.error('Failed to log period', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Period"
      subtitle="Update your bleeding status to refine cycle estimates"
    >
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-rose-500 mb-2 animate-bounce" />
          <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">Period Logged</h4>
          <p className="text-xs text-slate-500 mt-1">Your cycle recommendations have adjusted.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setActionType('start')}
              className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                actionType === 'start'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Period Started
            </button>
            <button
              type="button"
              onClick={() => setActionType('end')}
              className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                actionType === 'end'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Period Ended
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
              <CalendarIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {actionType === 'start' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Optional Notes (flow, cramps)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Mild cramps, morning start"
                rows={2}
                className="w-full px-4 py-2.5 rounded-2xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="w-1/2" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="rose" className="w-1/2" isLoading={isLoading}>
              Save Log
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
