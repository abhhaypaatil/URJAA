// Constants & Configuration for Urjaa
import { PhaseType } from '../types';

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

export interface PhaseLifeSync {
  hormoneProfile: string;
  workAndFocus: string;
  movementPillar: string;
  nutritionPillar: string;
  skinAndBody: string;
  socialEnergy: 'High & Magnetic' | 'Expressive & Vibrant' | 'Focused & Selective' | 'Introspective & Low';
  recommendedActivities: string[];
  seedCycling: string;
}

export const CYCLE_SYNC_GUIDE: Record<PhaseType, PhaseLifeSync> = {
  Menstrual: {
    hormoneProfile: 'Estrogen & Progesterone at baseline; resting metabolic rate.',
    workAndFocus: 'Strategic review, deep evaluation, solo writing, and setting intuitive goals. Minimize high-pressure presentations.',
    movementPillar: 'Restorative yin yoga, slow diaphragmatic breathing, gentle pelvic release, and leisurely walking.',
    nutritionPillar: 'Iron-rich warm stews, dark chocolate, bone broth or lentil soups, warming spices (ginger/cinnamon), and hydration.',
    skinAndBody: 'Skin barrier is delicate and sensitive; prioritize gentle cleansing, ceramide barrier creams, and deep rest.',
    socialEnergy: 'Introspective & Low',
    recommendedActivities: ['Journaling & planning', 'Warm magnesium bath', 'Early bedtime', 'Comfort reading'],
    seedCycling: 'Flaxseeds & Pumpkin seeds (support healthy prostaglandin balance)',
  },
  Follicular: {
    hormoneProfile: 'Estradiol & FSH steadily rising; increasing cellular regeneration & cognitive agility.',
    workAndFocus: 'Brainstorming, starting ambitious initiatives, creative problem-solving, and pitching new ideas (estrogen & dopamine surge).',
    movementPillar: 'Dynamic bodyweight, strength training with progressive resistance, light interval cardio, and outdoor runs.',
    nutritionPillar: 'Sprouted grains, cruciferous sulforaphane (broccoli/kale), fermented probiotics, pumpkin seeds, and lean protein.',
    skinAndBody: 'Natural collagen production peaks; skin looks luminous and firm. Great time for active facials or exfoliating treatments.',
    socialEnergy: 'Expressive & Vibrant',
    recommendedActivities: ['Starting new habits', 'Social networking', 'Creative sprints', 'Try a new workout format'],
    seedCycling: 'Flaxseeds & Pumpkin seeds (support rising estrogen balance)',
  },
  Ovulatory: {
    hormoneProfile: 'LH surge, peak Estradiol, and brief Testosterone spike; highest energy & metabolic speed.',
    workAndFocus: 'High-stakes presentations, critical negotiations, public speaking, and team leadership.',
    movementPillar: 'Peak strength training, bodyweight power flows, challenging intervals, and high-cadence athletic movement.',
    nutritionPillar: 'Antioxidant berries, raw leafy greens, cold-pressed olive oil, sesame seeds, and hydrating light meals.',
    skinAndBody: 'Peak vascular glow; slight sebum elevation, so opt for light water-gel hydration and oil-free cleansers.',
    socialEnergy: 'High & Magnetic',
    recommendedActivities: ['Keynote / Pitching', 'Dinner parties & social outings', 'Challenging personal bests', 'Collaborative sessions'],
    seedCycling: 'Sesame seeds & Sunflower seeds (support progesterone surge)',
  },
  Luteal: {
    hormoneProfile: 'Progesterone dominant; body temperature slightly elevated, increased caloric need (~150-300 kcal/day).',
    workAndFocus: 'Detail-oriented execution, editing, organizing workspace, wrapping up loose ends, and administrative tasks.',
    movementPillar: 'Mat Pilates, resistance band sculpting, steady incline walking, and low-cortisol circuits.',
    nutritionPillar: 'Slow-burn complex carbohydrates (sweet potatoes, quinoa), magnesium-rich seeds, potassium, and calming teas.',
    skinAndBody: 'Progesterone promotes sebum; focus on clarifying gentle BHA/salicylic acid, clay masks, and cooling hydration.',
    socialEnergy: 'Focused & Selective',
    recommendedActivities: ['Decluttering & cleaning', 'Meal prep for next cycle', 'Deep solo focus', 'Healthy boundary setting'],
    seedCycling: 'Sesame seeds & Sunflower seeds (nourish luteal progesterone balance)',
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
