import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Meal } from '../../types';
import { Check, Sparkles } from 'lucide-react';

interface SubstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal?: Meal | null;
  onSelectSubstitute: (substituteTitle: string) => void;
}

const DEFAULT_SUBSTITUTES: Record<string, Array<{ title: string; desc: string; reason: string }>> = {
  Breakfast: [
    { title: 'Chia Seed & Almond Milk Glow Pudding', desc: 'Overnight chia soaked in unsweetened almond milk with berries', reason: 'High omega-3 & gentle on digestion' },
    { title: 'Spinach & Tofu Warm Scramble', desc: 'Crumbled firm tofu sauteed with baby spinach and turmeric', reason: 'High protein plant-based alternative' },
  ],
  Lunch: [
    { title: 'Warm Spiced Chickpea & Kale Bowl', desc: 'Roasted chickpeas with massaged kale and creamy tahini dressing', reason: 'Rich in iron and sustained fiber' },
    { title: 'Quinoa Edamame Rainbow Salad', desc: 'Fluffy quinoa with fresh edamame, cucumber, and lime vinaigrette', reason: 'Complete amino acids & low glycemic index' },
  ],
  Snack: [
    { title: 'Raw Walnuts & 75% Dark Chocolate', desc: 'A handful of raw walnuts with dark chocolate squares', reason: 'Magnesium boost for pelvic ease' },
    { title: 'Hummus with Crisp Celery & Bell Pepper', desc: 'Creamy garlic hummus with crunchy fresh vegetable batons', reason: 'Hydrating & fiber-rich' },
  ],
  Dinner: [
    { title: 'Coconut Lentil Dal with Steamed Greens', desc: 'Golden red lentil dal cooked in light coconut milk with broccoli florets', reason: 'Warming comfort & iron absorption' },
    { title: 'Grilled Herb Paneer / Tofu with Sweet Potato', desc: 'Marinated paneer or tofu over roasted spiced sweet potatoes', reason: 'Potassium & sustained sleep support' },
  ],
};

export const SubstitutionModal: React.FC<SubstitutionModalProps> = ({
  isOpen,
  onClose,
  meal,
  onSelectSubstitute,
}) => {
  if (!meal) return null;

  const options = DEFAULT_SUBSTITUTES[meal.meal_type] || DEFAULT_SUBSTITUTES.Breakfast;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Replace ${meal.meal_type}`}
      subtitle={`Choose a diet-respecting alternative for ${meal.title}`}
    >
      <div className="space-y-3 my-2">
        {options.map((opt, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-warm-50/50 dark:bg-slate-800/50 hover:border-rose-300 dark:hover:border-rose-800 transition-all cursor-pointer group"
            onClick={() => {
              onSelectSubstitute(opt.title);
              onClose();
            }}
          >
            <div className="flex items-start justify-between">
              <h5 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                {opt.title}
              </h5>
              <span className="p-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <Check className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {opt.desc}
            </p>
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-rose-700 dark:text-rose-300">
              <Sparkles className="w-3 h-3" />
              <span>{opt.reason}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <Button variant="outline" size="sm" onClick={onClose}>
          Keep Current Meal
        </Button>
      </div>
    </Modal>
  );
};
