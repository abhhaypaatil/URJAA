import React from 'react';

interface SymptomSelectorProps {
  bleedingStatus: string;
  onBleedingChange: (status: string) => void;
  cramps: string;
  onCrampsChange: (cramps: string) => void;
  bloating: string;
  onBloatingChange: (bloating: string) => void;
  sleep: string;
  onSleepChange: (sleep: string) => void;
  nutritionAdherence: string;
  onNutritionChange: (adherence: string) => void;
}

const BLEEDING_OPTIONS = [
  { id: 'period_started', label: 'Period Started' },
  { id: 'period_continuing', label: 'Continuing Flow' },
  { id: 'period_ended', label: 'Period Ended' },
  { id: 'no_bleeding', label: 'No Bleeding' },
];

const SEVERITY_OPTIONS = ['None', 'Mild', 'Moderate', 'Severe'];
const SLEEP_OPTIONS = ['Good', 'Okay', 'Poor'];
const NUTRITION_OPTIONS = [
  { id: 'Followed', label: 'Followed Plan' },
  { id: 'Partially followed', label: 'Partial' },
  { id: 'Did not follow', label: 'Did Not Follow' },
];

export const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  bleedingStatus,
  onBleedingChange,
  cramps,
  onCrampsChange,
  bloating,
  onBloatingChange,
  sleep,
  onSleepChange,
  nutritionAdherence,
  onNutritionChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Bleeding Flow */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
          Bleeding / Flow
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {BLEEDING_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onBleedingChange(opt.id)}
              className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                bleedingStatus === opt.id
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cramps & Bloating */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Pelvic Cramps
          </label>
          <div className="grid grid-cols-4 gap-1">
            {SEVERITY_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onCrampsChange(s)}
                className={`py-1.5 rounded-xl text-xs border transition-all ${
                  cramps === s
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Bloating
          </label>
          <div className="grid grid-cols-4 gap-1">
            {SEVERITY_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onBloatingChange(s)}
                className={`py-1.5 rounded-xl text-xs border transition-all ${
                  bloating === s
                    ? 'border-sapphire-500 bg-sapphire-50 dark:bg-sapphire-950/60 text-sapphire-700 dark:text-sapphire-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sleep & Nutrition Adherence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Sleep Quality
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {SLEEP_OPTIONS.map((sl) => (
              <button
                key={sl}
                type="button"
                onClick={() => onSleepChange(sl)}
                className={`py-1.5 rounded-xl text-xs border transition-all ${
                  sleep === sl
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                {sl}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Nutrition Adherence
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {NUTRITION_OPTIONS.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => onNutritionChange(n.id)}
                className={`py-1.5 px-1 rounded-xl text-[11px] border transition-all truncate ${
                  nutritionAdherence === n.id
                    ? 'border-sage-500 bg-sage-50 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
