/**
 * Urjaa Gamification & Quest Service
 * 
 * Implements lightweight, encouraging wellness habit gamification:
 * - Level and XP progression derived from simple daily wellness actions
 * - Non-punitive consistency encouragement (no lost levels, guilt-free streaks)
 * - Daily quest management with Cloudinary media integration
 * - Synchronized per user with local storage persistence
 */

import { Achievement } from '../types';

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  category: 'hydration' | 'movement' | 'nutrition' | 'mindfulness' | 'checkin';
  assetKey: string; // References MEDIA_MANIFEST in constants/mediaManifest.ts
  completed: boolean;
  completedAt?: string;
  actionLabel: string;
  actionRoute?: string;
}

export interface GamificationState {
  level: number;
  levelTitle: string;
  currentXp: number;
  xpForNextLevel: number;
  totalXpEarned: number;
  streakDays: number;
  quests: Quest[];
  achievements?: Achievement[];
  lastActiveDate: string;
}

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-quest',
    title: 'First Quest Completed',
    description: 'Complete your very first daily wellness quest.',
    category: 'quest',
    icon: 'Sparkles',
    unlocked: false,
    progress: 0,
    max_progress: 1,
  },
  {
    id: 'ach-movement-explorer',
    title: 'Movement Explorer',
    description: 'Complete a guided movement session or movement quest.',
    category: 'movement',
    icon: 'Activity',
    unlocked: false,
    progress: 0,
    max_progress: 1,
  },
  {
    id: 'ach-mindful-moments',
    title: 'Mindful Moments',
    description: 'Complete a restorative evening pulse or mindful check-in.',
    category: 'mindfulness',
    icon: 'Heart',
    unlocked: false,
    progress: 0,
    max_progress: 1,
  },
  {
    id: 'ach-strength-builder',
    title: 'Strength Builder',
    description: 'Embrace progressive bodyweight strength for sustained vitality.',
    category: 'strength',
    icon: 'Dumbbell',
    unlocked: false,
    progress: 0,
    max_progress: 1,
  },
  {
    id: 'ach-consistency-milestone',
    title: 'Consistency Milestone',
    description: 'Nurture your wellness journey with 3 logged days.',
    category: 'consistency',
    icon: 'Flame',
    unlocked: false,
    progress: 1,
    max_progress: 3,
  },
  {
    id: 'ach-wellness-explorer',
    title: 'Wellness Explorer',
    description: 'Explore and complete quests across 3 different wellness realms.',
    category: 'quest',
    icon: 'Compass',
    unlocked: false,
    progress: 0,
    max_progress: 3,
  },
  {
    id: 'ach-personal-progress',
    title: 'Personal Progress Milestone',
    description: 'Advance to Level 2 (Mindful Bloom) through gentle momentum.',
    category: 'level',
    icon: 'Award',
    unlocked: false,
    progress: 1,
    max_progress: 2,
  },
];

const STORAGE_PREFIX = 'urjaa_wellness_gamification_';

// Level thresholds: Level 1 = 0-200, Level 2 = 201-450, Level 3 = 451-750, etc.
const LEVEL_TITLES = [
  'Gentle Spark',
  'Mindful Bloom',
  'Radiant Rhythm',
  'Steady Harmony',
  'Vital Flow',
  'Solar Alchemist',
  'Inner Luminary',
];

export const getLevelInfo = (totalXp: number) => {
  let level = 1;
  let remainingXp = totalXp;
  let xpRequired = 200;

  while (remainingXp >= xpRequired) {
    remainingXp -= xpRequired;
    level += 1;
    xpRequired = Math.round(xpRequired * 1.25);
  }

  const titleIndex = Math.min(level - 1, LEVEL_TITLES.length - 1);
  return {
    level,
    levelTitle: LEVEL_TITLES[titleIndex],
    currentLevelXp: remainingXp,
    xpForNextLevel: xpRequired,
    progressPercentage: Math.min(100, Math.round((remainingXp / xpRequired) * 100)),
  };
};

/**
 * Standard daily quests aligned with Cloudinary media manifest keys
 */
export const DEFAULT_DAILY_QUESTS: Quest[] = [
  {
    id: 'quest-hydration',
    title: 'Mindful Morning Hydration',
    description: 'Log at least 500ml of water to rehydrate your cells upon waking.',
    xpReward: 40,
    category: 'hydration',
    assetKey: 'quest-hydration-glow',
    completed: false,
    actionLabel: 'Log Water',
    actionRoute: '/check-in',
  },
  {
    id: 'quest-movement',
    title: 'Daily Movement Flow',
    description: 'Complete today’s recommended phase-aligned routine or a 5-minute stretch.',
    xpReward: 80,
    category: 'movement',
    assetKey: 'quest-kinetic-spark',
    completed: false,
    actionLabel: 'Start Movement',
    actionRoute: '/workout',
  },
  {
    id: 'quest-nourish',
    title: 'Phase-Aligned Nourishment',
    description: 'Follow or substitute a micronutrient-dense meal tailored to your cycle.',
    xpReward: 60,
    category: 'nutrition',
    assetKey: 'quest-alchemy-plate',
    completed: false,
    actionLabel: 'View Meal Plan',
    actionRoute: '/nutrition',
  },
  {
    id: 'quest-evening',
    title: 'Restorative Nervous System Reset',
    description: 'Take 5 mindful breaths or log your evening wellness pulse.',
    xpReward: 50,
    category: 'mindfulness',
    assetKey: 'quest-evening-unwind',
    completed: false,
    actionLabel: 'Complete Check-in',
    actionRoute: '/check-in',
  },
];

/**
 * Retrieves the current gamification state for a user
 */
export const getGamificationState = (userId?: string): GamificationState => {
  const key = `${STORAGE_PREFIX}${userId || 'guest'}`;
  const today = new Date().toISOString().split('T')[0];

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed: GamificationState = JSON.parse(raw);
      // Reset daily quests if date changed
      if (parsed.lastActiveDate !== today) {
        parsed.quests = DEFAULT_DAILY_QUESTS.map((q) => ({ ...q, completed: false }));
        parsed.lastActiveDate = today;
        saveGamificationState(parsed, userId);
      }
      return parsed;
    }
  } catch (e) {
    console.warn('[Gamification] Could not load state, using initial:', e);
  }

  // Initial state for new users
  const levelData = getLevelInfo(0);
  const initialState: GamificationState = {
    level: levelData.level,
    levelTitle: levelData.levelTitle,
    currentXp: levelData.currentLevelXp,
    xpForNextLevel: levelData.xpForNextLevel,
    totalXpEarned: 0,
    streakDays: 1,
    quests: DEFAULT_DAILY_QUESTS,
    achievements: DEFAULT_ACHIEVEMENTS,
    lastActiveDate: today,
  };

  saveGamificationState(initialState, userId);
  return initialState;
};

/**
 * Persists the gamification state to localStorage
 */
export const saveGamificationState = (state: GamificationState, userId?: string) => {
  const key = `${STORAGE_PREFIX}${userId || 'guest'}`;
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    console.warn('[Gamification] Failed to persist state:', e);
  }
};

/**
 * Swaps an incomplete quest for a gentle alternative (offline fallback)
 */
export const swapQuestLocal = (
  questId: string,
  userId?: string
): { state: GamificationState; replacement?: Quest } => {
  const current = getGamificationState(userId);
  const quest = current.quests.find((q) => q.id === questId);

  if (!quest || quest.completed) {
    return { state: current };
  }

  const replacement: Quest = {
    id: `${questId}-alt`,
    title: quest.category === 'movement' 
      ? 'Gentle 5-Minute Pelvic & Spine Release' 
      : quest.category === 'hydration' 
      ? 'Warm Digestive Herbal Infusion'
      : quest.category === 'nutrition'
      ? 'Mindful Hydrating Snack & Digestive Rest'
      : '2-Minute Nervous System Decompression',
    description: 'A compassionate, restorative alternative that nurtures your body without pressure.',
    xpReward: quest.xpReward,
    category: quest.category,
    assetKey: quest.assetKey,
    completed: false,
    actionLabel: 'Explore Alternative',
    actionRoute: quest.actionRoute,
  };

  const updatedQuests = current.quests.map((q) => (q.id === questId ? replacement : q));
  const updatedState: GamificationState = {
    ...current,
    quests: updatedQuests,
  };

  saveGamificationState(updatedState, userId);
  return { state: updatedState, replacement };
};

/**
 * Marks a daily quest as completed and awards XP
 */
export const completeQuest = (
  questId: string,
  userId?: string
): { state: GamificationState; earnedXp: number; leveledUp: boolean } => {
  const current = getGamificationState(userId);
  const quest = current.quests.find((q) => q.id === questId);

  if (!quest || quest.completed) {
    return { state: current, earnedXp: 0, leveledUp: false };
  }

  const earnedXp = quest.xpReward;
  const previousLevel = current.level;
  const newTotalXp = current.totalXpEarned + earnedXp;
  const levelInfo = getLevelInfo(newTotalXp);

  quest.completed = true;
  quest.completedAt = new Date().toISOString();

  const updatedState: GamificationState = {
    ...current,
    level: levelInfo.level,
    levelTitle: levelInfo.levelTitle,
    currentXp: levelInfo.currentLevelXp,
    xpForNextLevel: levelInfo.xpForNextLevel,
    totalXpEarned: newTotalXp,
  };

  saveGamificationState(updatedState, userId);

  return {
    state: updatedState,
    earnedXp,
    leveledUp: levelInfo.level > previousLevel,
  };
};

/**
 * Checks if a specific quest is completed
 */
export const isQuestCompleted = (questId: string, userId?: string): boolean => {
  const state = getGamificationState(userId);
  return Boolean(state.quests.find((q) => q.id === questId)?.completed);
};
