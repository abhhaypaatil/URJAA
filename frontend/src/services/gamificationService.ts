/**
 * Urjaa Gamification & Quest Service
 * 
 * Implements lightweight, encouraging wellness habit gamification:
 * - Level and XP progression derived from simple daily wellness actions
 * - Non-punitive consistency encouragement (no lost levels, guilt-free streaks)
 * - Daily quest management with Cloudinary media integration
 * - Synchronized per user with local storage persistence
 */

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
  lastActiveDate: string;
}

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
