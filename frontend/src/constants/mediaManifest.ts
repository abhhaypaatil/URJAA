/**
 * Urjaa Media Manifest
 * 
 * Central registry of all Cloudinary-hosted media assets across Urjaa.
 * Organizes assets by logical categories:
 * - exercise/mobility
 * - exercise/strength
 * - exercise/stretching
 * - exercise/recovery
 * - wellness/education
 * - wellness/illustrations
 * - quests/thumbnails
 * 
 * If Cloudinary is unconfigured or a specific asset is not yet uploaded,
 * each entry specifies an accessible title, alt text, and fallback behavior.
 */

export type MediaCategory =
  | 'exercise/mobility'
  | 'exercise/strength'
  | 'exercise/stretching'
  | 'exercise/recovery'
  | 'wellness/education'
  | 'wellness/illustrations'
  | 'quests/thumbnails';

export interface MediaAssetEntry {
  assetKey: string;
  publicId: string;
  mediaType: 'image' | 'video';
  title: string;
  altText: string;
  category: MediaCategory;
  durationSeconds?: number;
  thumbnailPublicId?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:4';
  defaultAnimationArchetype?: string;
}

export const MEDIA_MANIFEST: Record<string, MediaAssetEntry> = {
  // ─── 1. EXERCISE / MOBILITY ──────────────────────────────────────
  'ex-cat-cow': {
    assetKey: 'ex-cat-cow',
    publicId: 'urjaa/exercise/mobility/cat_cow_mobility',
    mediaType: 'video',
    title: 'Cat-Cow Spinal Wave',
    altText: 'Demonstration of gentle pelvic and spinal articulation on all fours',
    category: 'exercise/mobility',
    durationSeconds: 15,
    thumbnailPublicId: 'urjaa/exercise/mobility/cat_cow_poster',
    aspectRatio: '16:9',
    defaultAnimationArchetype: 'stretch_pattern',
  },
  'ex-thoracic-open': {
    assetKey: 'ex-thoracic-open',
    publicId: 'urjaa/exercise/mobility/thoracic_open_books',
    mediaType: 'image',
    title: 'Side-Lying Thoracic Open Books',
    altText: 'Guided upper thoracic rotation for posture and ribcage mobility',
    category: 'exercise/mobility',
    aspectRatio: '16:9',
    defaultAnimationArchetype: 'stretch_pattern',
  },
  'ex-hip-opener': {
    assetKey: 'ex-hip-opener',
    publicId: 'urjaa/exercise/mobility/pigeon_hip_opener',
    mediaType: 'image',
    title: 'Elevated Hip & Glute Opener',
    altText: 'Restorative hip flexor and glute stretch',
    category: 'exercise/mobility',
    aspectRatio: '16:9',
    defaultAnimationArchetype: 'lunge_pattern',
  },

  // ─── 2. EXERCISE / STRENGTH ──────────────────────────────────────
  'ex-tempo-squats': {
    assetKey: 'ex-tempo-squats',
    publicId: 'urjaa/exercise/strength/tempo_bodyweight_squats',
    mediaType: 'video',
    title: 'Tempo Bodyweight Squats',
    altText: 'Controlled bodyweight squats focusing on quadriceps and glute recruitment',
    category: 'exercise/strength',
    durationSeconds: 12,
    thumbnailPublicId: 'urjaa/exercise/strength/tempo_squats_poster',
    aspectRatio: '16:9',
    defaultAnimationArchetype: 'squat_pattern',
  },
  'ex-incline-pushups': {
    assetKey: 'ex-incline-pushups',
    publicId: 'urjaa/exercise/strength/incline_pushups',
    mediaType: 'video',
    title: 'Incline Push-Ups',
    altText: 'Elevated upper-body push-up demonstrating chest, shoulder, and triceps form',
    category: 'exercise/strength',
    durationSeconds: 12,
    thumbnailPublicId: 'urjaa/exercise/strength/incline_pushups_poster',
    aspectRatio: '16:9',
    defaultAnimationArchetype: 'push_pattern',
  },
  'ex-glute-bridge': {
    assetKey: 'ex-glute-bridge',
    publicId: 'urjaa/exercise/strength/glute_bridge_hold',
    mediaType: 'image',
    title: 'Pelvic Glute Bridge Hold',
    altText: 'Supine glute bridge hold targeting posterior chain and pelvic stability',
    category: 'exercise/strength',
    aspectRatio: '16:9',
    defaultAnimationArchetype: 'static_hold',
  },
  'ex-reverse-lunge': {
    assetKey: 'ex-reverse-lunge',
    publicId: 'urjaa/exercise/strength/controlled_reverse_lunge',
    mediaType: 'video',
    title: 'Controlled Reverse Lunge',
    altText: 'Quiet low-impact step-back lunges for single-leg stability',
    category: 'exercise/strength',
    durationSeconds: 14,
    thumbnailPublicId: 'urjaa/exercise/strength/reverse_lunge_poster',
    aspectRatio: '16:9',
    defaultAnimationArchetype: 'lunge_pattern',
  },

  // ─── 3. EXERCISE / STRETCHING ────────────────────────────────────
  'ex-hamstring-flow': {
    assetKey: 'ex-hamstring-flow',
    publicId: 'urjaa/exercise/stretching/supine_hamstring_flow',
    mediaType: 'image',
    title: 'Supine Hamstring Stretch Flow',
    altText: 'Gentle supine hamstring and calf decompression',
    category: 'exercise/stretching',
    aspectRatio: '16:9',
    defaultAnimationArchetype: 'stretch_pattern',
  },
  'ex-childs-pose': {
    assetKey: 'ex-childs-pose',
    publicId: 'urjaa/exercise/stretching/wide_knee_childs_pose',
    mediaType: 'image',
    title: "Wide-Knee Child's Pose",
    altText: 'Deep lower back and lat relaxation in resting posture',
    category: 'exercise/stretching',
    aspectRatio: '16:9',
    defaultAnimationArchetype: 'stretch_pattern',
  },

  // ─── 4. EXERCISE / RECOVERY ──────────────────────────────────────
  'ex-legs-up-wall': {
    assetKey: 'ex-legs-up-wall',
    publicId: 'urjaa/exercise/recovery/legs_up_wall_restoration',
    mediaType: 'image',
    title: 'Viparita Karani (Legs-Up-the-Wall)',
    altText: 'Lymphatic drainage and parasympathetic nervous system down-regulation',
    category: 'exercise/recovery',
    aspectRatio: '16:9',
    defaultAnimationArchetype: 'static_hold',
  },
  'ex-box-breathing': {
    assetKey: 'ex-box-breathing',
    publicId: 'urjaa/exercise/recovery/4_7_8_parasympathetic_breath',
    mediaType: 'image',
    title: '4-7-8 Breathwork Sanctuary',
    altText: 'Diaphragmatic rhythm for cortisol reduction and recovery',
    category: 'exercise/recovery',
    aspectRatio: '16:9',
    defaultAnimationArchetype: 'static_hold',
  },

  // ─── 5. WELLNESS / EDUCATION ─────────────────────────────────────
  'well-follicular-energy': {
    assetKey: 'well-follicular-energy',
    publicId: 'urjaa/wellness/education/follicular_energy_surge',
    mediaType: 'image',
    title: 'Follicular Phase: Natural Estrogen Rising',
    altText: 'Educational graphic illustrating estrogen stamina and optimal workout timing',
    category: 'wellness/education',
    aspectRatio: '16:9',
  },
  'well-luteal-recovery': {
    assetKey: 'well-luteal-recovery',
    publicId: 'urjaa/wellness/education/luteal_magnesium_synergy',
    mediaType: 'image',
    title: 'Luteal Phase: Magnesium & Thermoregulation',
    altText: 'Nutritional wellness guide on progesterone and electrolyte balance',
    category: 'wellness/education',
    aspectRatio: '16:9',
  },

  // ─── 6. WELLNESS / ILLUSTRATIONS ─────────────────────────────────
  'illust-alchemy-bowl': {
    assetKey: 'illust-alchemy-bowl',
    publicId: 'urjaa/wellness/illustrations/alchemy_kitchen_bowl',
    mediaType: 'image',
    title: 'Nourishing Alchemy Harvest',
    altText: 'Warm illustration of micronutrient-dense balanced whole foods bowl',
    category: 'wellness/illustrations',
    aspectRatio: '1:1',
  },
  'illust-hydration-vortex': {
    assetKey: 'illust-hydration-vortex',
    publicId: 'urjaa/wellness/illustrations/hydration_celestial_water',
    mediaType: 'image',
    title: 'Cellular Hydration Rhythm',
    altText: 'Pastel sky-blue hydration droplets and cellular replenishment visual',
    category: 'wellness/illustrations',
    aspectRatio: '1:1',
  },

  // ─── 7. QUESTS / THUMBNAILS (For Stage 3 Gamified Quests) ────────
  'quest-hydration-glow': {
    assetKey: 'quest-hydration-glow',
    publicId: 'urjaa/quests/thumbnails/mindful_hydration_goal',
    mediaType: 'image',
    title: 'Mindful Hydration Pulse Quest',
    altText: 'Morning water intake quest card visual with pastel sky blue aesthetic',
    category: 'quests/thumbnails',
    aspectRatio: '16:9',
  },
  'quest-kinetic-spark': {
    assetKey: 'quest-kinetic-spark',
    publicId: 'urjaa/quests/thumbnails/kinetic_movement_streak',
    mediaType: 'image',
    title: 'Daily Movement Flow Quest',
    altText: '10-minute restorative movement quest card visual',
    category: 'quests/thumbnails',
    aspectRatio: '16:9',
  },
  'quest-alchemy-plate': {
    assetKey: 'quest-alchemy-plate',
    publicId: 'urjaa/quests/thumbnails/phase_aligned_nourishment',
    mediaType: 'image',
    title: 'Color Your Plate Quest',
    altText: 'Micronutrient meal quest visual with pistachio and blush accents',
    category: 'quests/thumbnails',
    aspectRatio: '16:9',
  },
  'quest-evening-unwind': {
    assetKey: 'quest-evening-unwind',
    publicId: 'urjaa/quests/thumbnails/evening_nervous_system_unwind',
    mediaType: 'image',
    title: 'Restorative Sleep Unwind Quest',
    altText: 'Gentle night routine quest visual with dark plum and warm ivory tones',
    category: 'quests/thumbnails',
    aspectRatio: '16:9',
  },
};

/**
 * Helper to lookup an asset by key
 */
export const getMediaEntry = (key: string): MediaAssetEntry | undefined => {
  return MEDIA_MANIFEST[key];
};

/**
 * Helper to get all assets for a category
 */
export const getMediaByCategory = (category: MediaCategory): MediaAssetEntry[] => {
  return Object.values(MEDIA_MANIFEST).filter((entry) => entry.category === category);
};


/**
 * Helper to match an exercise by ID, category, or name to a media manifest entry
 */
export const getMediaForExercise = (
  exerciseId?: string,
  exerciseName?: string,
  category?: string
): MediaAssetEntry | undefined => {
  const normName = (exerciseName || '').toLowerCase();
  const normId = (exerciseId || '').toLowerCase();

  if (normName.includes('cat') || normName.includes('cow') || normId.includes('cat')) {
    return MEDIA_MANIFEST['ex-cat-cow'];
  }
  if (normName.includes('squat') || normId.includes('squat')) {
    return MEDIA_MANIFEST['ex-tempo-squats'];
  }
  if (normName.includes('push') || normId.includes('push')) {
    return MEDIA_MANIFEST['ex-incline-pushups'];
  }
  if (normName.includes('bridge') || normId.includes('bridge')) {
    return MEDIA_MANIFEST['ex-glute-bridge'];
  }
  if (normName.includes('lunge') || normId.includes('lunge')) {
    return MEDIA_MANIFEST['ex-reverse-lunge'];
  }
  if (normName.includes('thoracic') || normName.includes('book')) {
    return MEDIA_MANIFEST['ex-thoracic-open'];
  }
  if (normName.includes('hip') || normName.includes('pigeon')) {
    return MEDIA_MANIFEST['ex-hip-opener'];
  }
  if (normName.includes('hamstring')) {
    return MEDIA_MANIFEST['ex-hamstring-flow'];
  }
  if (normName.includes('child')) {
    return MEDIA_MANIFEST['ex-childs-pose'];
  }
  if (normName.includes('wall') || normName.includes('legs')) {
    return MEDIA_MANIFEST['ex-legs-up-wall'];
  }
  if (normName.includes('breath') || normName.includes('box')) {
    return MEDIA_MANIFEST['ex-box-breathing'];
  }

  // Fallbacks by category
  if (category?.toLowerCase().includes('mobility')) {
    return MEDIA_MANIFEST['ex-cat-cow'];
  }
  if (category?.toLowerCase().includes('stretch')) {
    return MEDIA_MANIFEST['ex-childs-pose'];
  }
  if (category?.toLowerCase().includes('recovery')) {
    return MEDIA_MANIFEST['ex-legs-up-wall'];
  }

  return MEDIA_MANIFEST['ex-tempo-squats'];
};
