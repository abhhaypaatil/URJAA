// Constants & Configuration for Urjaa

export const MEDICAL_DISCLAIMER =
  'Urjaa provides wellness and educational recommendations and does not replace professional medical care.';

export const PHASE_CONFIG = {
  Menstrual: {
    name: 'Menstrual Phase',
    color: 'rose',
    bgLight: 'bg-rose-50 dark:bg-rose-950/40',
    borderLight: 'border-rose-200 dark:border-rose-800/60',
    textColor: 'text-rose-700 dark:text-rose-300',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/50',
    badgeText: 'text-rose-800 dark:text-rose-200',
    dotColor: 'bg-rose-500',
    summary: 'Rest, gentle recovery, iron-rich meals, and warming hydration.',
  },
  Follicular: {
    name: 'Follicular Phase',
    color: 'sapphire',
    bgLight: 'bg-sapphire-50 dark:bg-sapphire-950/40',
    borderLight: 'border-sapphire-200 dark:border-sapphire-800/60',
    textColor: 'text-sapphire-700 dark:text-sapphire-300',
    badgeBg: 'bg-sapphire-100 dark:bg-sapphire-900/50',
    badgeText: 'text-sapphire-800 dark:text-sapphire-200',
    dotColor: 'bg-sapphire-500',
    summary: 'Rising energy, dynamic movement, and lean protein nourishment.',
  },
  Ovulatory: {
    name: 'Ovulatory Phase',
    color: 'emerald',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderLight: 'border-emerald-200 dark:border-emerald-800/60',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    badgeText: 'text-emerald-800 dark:text-emerald-200',
    dotColor: 'bg-emerald-500',
    summary: 'Peak stamina, full-body strength, and antioxidant-rich foods.',
  },
  Luteal: {
    name: 'Luteal Phase',
    color: 'amber',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    borderLight: 'border-amber-200 dark:border-amber-800/60',
    textColor: 'text-amber-700 dark:text-amber-300',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/50',
    badgeText: 'text-amber-800 dark:text-amber-200',
    dotColor: 'bg-amber-500',
    summary: 'Low-impact sculpting, magnesium-dense foods, and mindful pacing.',
  },
};

export const WELLNESS_GOALS = [
  'Better overall health',
  'Fitness & Strength',
  'Weight management',
  'Better energy',
  'Better mood',
  'Cycle awareness',
];

export const DIETARY_PREFERENCES = [
  { id: 'Vegetarian', label: 'Vegetarian', desc: 'Plant-based with dairy' },
  { id: 'Eggetarian', label: 'Eggetarian', desc: 'Vegetarian plus eggs' },
  { id: 'Non-vegetarian', label: 'Non-vegetarian', desc: 'Includes poultry & fish' },
  { id: 'Vegan', label: 'Vegan', desc: '100% plant-based without animal products' },
];

export const DURATION_OPTIONS = [5, 10, 15, 20, 30, 45];
