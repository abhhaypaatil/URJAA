import {
  PhaseInfo,
  DailyCheckin,
  DailyRecommendation,
  RecommendedMeal,
  Workout,
  MonthSummary,
  UserProfile,
  UserPreferences,
  User,
} from '../types';

export const DEMO_USER: User = {
  id: 'demo-urjaa-user-001',
  email: 'maya@urjaa.world',
  created_at: new Date().toISOString(),
};

export const DEMO_PROFILE: UserProfile = {
  user_id: 'demo-urjaa-user-001',
  name: 'Maya',
  wellness_goal: 'Hormonal Balance & Gentle Energy',
  fitness_level: 'Beginner',
  preferred_workout_duration: 15,
  dietary_preference: 'Vegetarian',
  exercise_limitations: ['Sensitive lower back'],
  pcos_pcod_mode: false,
  updated_at: new Date().toISOString(),
};

export const DEMO_PREFERENCES: UserPreferences = {
  user_id: 'demo-urjaa-user-001',
  theme_preference: 'dark',
  quiet_mode: true,
  notify_period: true,
  notify_checkin: true,
  notify_hydration: true,
  notify_workout: true,
  notify_nutrition: true,
  notify_insights: true,
  updated_at: new Date().toISOString(),
};

export const DEMO_PHASE_INFO: PhaseInfo = {
  current_phase: 'Follicular',
  cycle_day: 9,
  total_cycle_length: 29,
  estimated_ovulation_day: 15,
  estimated_next_period: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
  days_until_next_period: 20,
  confidence_score: 94,
  confidence_level: 'High',
  confidence_label: 'High Confidence (Verified rhythm)',
  is_irregular: false,
  phase_description:
    'Estrogen is steadily ascending. Mental clarity, neuro-plasticity, and physical stamina are naturally peaking as follicles mature.',
  energy_trend: 'Ascending / High Stamina',
  recommended_focus: 'Dynamic movement, complex nutrient density, and creative ideation.',
};

export const DEMO_WORKOUT: Workout = {
  id: 'rec-follicular-001',
  title: 'Follicular Dynamic Energizer',
  description:
    'Rhythm-synced flow capitalizing on rising estrogen. Focuses on fluid compound activation, core stabilization, and light kinetic warmth.',
  category: 'Full body',
  phase_target: 'Follicular',
  intensity: 'Moderate',
  estimated_duration_min: 15,
  is_quiet: true,
  is_low_impact: true,
  exercises: [
    {
      exercise_id: 'ex-01',
      order_index: 1,
      mode: 'time',
      target: 1,
      target_seconds: 30,
      rest_seconds: 15,
      exercise: {
        id: 'ex-01',
        name: 'Step Jacks (Low-Impact)',
        category: 'Cardio Prep',
        muscle_groups: ['Calves', 'Shoulders', 'Full body'],
        difficulty: 'Beginner',
        equipment: 'None (Bodyweight)',
        type: 'time',
        default_reps: 1,
        default_duration_seconds: 30,
        rest_seconds: 15,
        instructions: [
          'Step right foot outward while rhythmically floating arms overhead.',
          'Step back smoothly and repeat on the left.',
          'Maintain relaxed breathing and soft knees.',
        ],
        common_mistakes: ['Locking knees stiffly', 'Jerking shoulders upward'],
        quiet_friendly: true,
        low_impact: true,
        animation_type: 'jumping_pattern',
      },
    },
    {
      exercise_id: 'ex-02',
      order_index: 2,
      mode: 'reps',
      target: 12,
      target_seconds: 35,
      rest_seconds: 20,
      exercise: {
        id: 'ex-02',
        name: 'Harmonic Bodyweight Squats',
        category: 'Lower body',
        muscle_groups: ['Quads', 'Glutes', 'Hamstrings'],
        difficulty: 'Beginner',
        equipment: 'None (Bodyweight)',
        type: 'reps',
        default_reps: 12,
        default_duration_seconds: 35,
        rest_seconds: 20,
        instructions: [
          'Feet shoulder-width apart, toes slightly turned out.',
          'Hinge hips down and back as if sitting into an ethereal chair.',
          'Press evenly through heels and midfoot to ascend.',
        ],
        common_mistakes: ['Knees caving inwards', 'Heels lifting off ground'],
        quiet_friendly: true,
        low_impact: true,
        animation_type: 'squat_pattern',
      },
    },
    {
      exercise_id: 'ex-03',
      order_index: 3,
      mode: 'reps',
      target: 10,
      target_seconds: 30,
      rest_seconds: 20,
      exercise: {
        id: 'ex-03',
        name: 'Incline / Knee Push-ups',
        category: 'Upper body',
        muscle_groups: ['Chest', 'Triceps', 'Shoulders', 'Core'],
        difficulty: 'Beginner',
        equipment: 'Mat',
        type: 'reps',
        default_reps: 10,
        default_duration_seconds: 30,
        rest_seconds: 20,
        instructions: [
          'Hands shoulder-width apart, spine aligned from crown to knees.',
          'Lower chest smoothly toward the mat.',
          'Press firmly through palms to full lockout.',
        ],
        common_mistakes: ['Dropping hips or belly', 'Flaring elbows excessively'],
        quiet_friendly: true,
        low_impact: true,
        animation_type: 'push_pattern',
      },
    },
    {
      exercise_id: 'ex-04',
      order_index: 4,
      mode: 'reps',
      target: 14,
      target_seconds: 30,
      rest_seconds: 15,
      exercise: {
        id: 'ex-04',
        name: 'Glute Activation Bridges',
        category: 'Lower body',
        muscle_groups: ['Glutes', 'Hamstrings', 'Lower back'],
        difficulty: 'Beginner',
        equipment: 'Mat',
        type: 'reps',
        default_reps: 14,
        default_duration_seconds: 30,
        rest_seconds: 15,
        instructions: [
          'Lie on back with knees bent and feet hip-distance apart.',
          'Drive through heels to elevate hips towards the sky.',
          'Squeeze glutes at peak for 1 second with calm breath.',
        ],
        common_mistakes: ['Hyperextending lower lumbar spine'],
        quiet_friendly: true,
        low_impact: true,
        animation_type: 'static_hold',
      },
    },
    {
      exercise_id: 'ex-05',
      order_index: 5,
      mode: 'time',
      target: 1,
      target_seconds: 35,
      rest_seconds: 10,
      exercise: {
        id: 'ex-05',
        name: 'Forearm Core Pillar Hold',
        category: 'Core',
        muscle_groups: ['Transverse Abdominis', 'Shoulders', 'Glutes'],
        difficulty: 'Beginner',
        equipment: 'Mat',
        type: 'time',
        default_reps: 1,
        default_duration_seconds: 35,
        rest_seconds: 10,
        instructions: [
          'Forearms and toes grounded, elbows under shoulders.',
          'Draw naval gently inward and lengthen neck.',
          'Breathe rhythmically into the back ribcage.',
        ],
        common_mistakes: ['Piking hips up', 'Sagging lumbar curve'],
        quiet_friendly: true,
        low_impact: true,
        animation_type: 'plank_pattern',
      },
    },
  ],
};

export const DEMO_RECOMMENDATION: DailyRecommendation = {
  date: new Date().toISOString().split('T')[0],
  cycle_phase: 'Follicular',
  cycle_day: 9,
  workout: DEMO_WORKOUT,
  workout_focus: 'Neuro-Muscular Awakening & Kinetic Energy',
  intensity_level: 'Moderate / Stimulating',
  nutrition_focus: 'Cruciferous greens, fermented probiotics & complex amino acids',
  recommended_nutrients: ['Folate', 'Vitamin B6', 'Zinc', 'Soluble Fiber'],
  hydration_target_ml: 2200,
  hydration_tip: 'Electrolyte balance supports follicular follicle maturation and prevents afternoon fatigue.',
  recovery_note: 'Optimal window for learning complex motor patterns or trying new resistance cadences.',
  is_pcos_adapted: false,
  disclaimer: 'Urjaa provides wellness and educational recommendations and does not replace medical advice.',
};

export const DEMO_MEALS: RecommendedMeal[] = [
  {
    completed: true,
    phase_focus: 'Follicular',
    meal: {
      id: 'm-01',
      title: 'Greek Yogurt & Golden Flax Power Bowl',
      meal_type: 'Breakfast',
      phase_target: 'Follicular',
      dietary_preference: 'Vegetarian',
      description: 'Probiotic-dense organic yogurt paired with freshly milled flaxseed and wild antioxidant berries.',
      key_nutrients: ['Bio-Protein (18g)', 'Lignans', 'Probiotics'],
      prep_time_min: 5,
      items: [
        {
          id: 'mi-1',
          meal_id: 'm-01',
          food_name: 'Greek Yogurt (Plain)',
          portion: '200g',
          category: 'Dairy / Protein',
          substitution_options: [
            { name: 'Coconut Kefir', reason: 'Dairy-free probiotic alternative' },
            { name: 'Silken Tofu Puree', reason: 'High-isoflavone plant protein' },
          ],
        },
        {
          id: 'mi-2',
          meal_id: 'm-01',
          food_name: 'Cold-Milled Golden Flaxseed',
          portion: '1.5 tbsp',
          category: 'Seeds',
          substitution_options: [
            { name: 'Chia Seeds', reason: 'High hydration retention' },
            { name: 'Hemp Hearts', reason: 'Complete amino acid profile' },
          ],
        },
      ],
    },
  },
  {
    completed: false,
    phase_focus: 'Follicular',
    meal: {
      id: 'm-02',
      title: 'Quinoa Edamame & Rainbow Crunch Bowl',
      meal_type: 'Lunch',
      phase_target: 'Follicular',
      dietary_preference: 'Vegetarian',
      description: 'Fluffy whole-grain quinoa tossed with steamed edamame, shaved carrots, cilantro, and toasted sesame tahini.',
      key_nutrients: ['Complete Plant Protein', 'Folate', 'Phytoestrogens'],
      prep_time_min: 15,
      items: [
        {
          id: 'mi-3',
          meal_id: 'm-02',
          food_name: 'Organic Tricolor Quinoa',
          portion: '1 cup cooked',
          category: 'Grains',
          substitution_options: [
            { name: 'Brown Basmati Rice', reason: 'Soothing easy digest' },
            { name: 'Farro', reason: 'Hearty nutty chew' },
          ],
        },
        {
          id: 'mi-4',
          meal_id: 'm-02',
          food_name: 'Shelled Edamame',
          portion: '1/2 cup',
          category: 'Plant Protein',
          substitution_options: [
            { name: 'Sprouted Chickpeas', reason: 'High zinc & iron' },
            { name: 'Pan-Seared Paneer', reason: 'Rich vegetarian calcium' },
          ],
        },
      ],
    },
  },
  {
    completed: false,
    phase_focus: 'Follicular',
    meal: {
      id: 'm-03',
      title: 'Turmeric Spiced Paneer & Roasted Zucchini Pilaf',
      meal_type: 'Dinner',
      phase_target: 'Follicular',
      dietary_preference: 'Vegetarian',
      description: 'Golden paneer cubes simmered gently with cumin, turmeric, sweet bell peppers, and fragrant herbs.',
      key_nutrients: ['Calcium (320mg)', 'Curcumin', 'Vitamin C'],
      prep_time_min: 25,
      items: [
        {
          id: 'mi-5',
          meal_id: 'm-03',
          food_name: 'Farm Fresh Paneer Cubes',
          portion: '120g',
          category: 'Protein',
          substitution_options: [
            { name: 'Extra Firm Tofu', reason: 'Lower saturated fat plant source' },
            { name: 'Tempeh Strips', reason: 'Fermented gut-friendly option' },
          ],
        },
      ],
    },
  },
  {
    completed: false,
    phase_focus: 'Follicular',
    meal: {
      id: 'm-04',
      title: 'Crisp Apple Batons with Roasted Cashew Butter',
      meal_type: 'Snack',
      phase_target: 'Follicular',
      dietary_preference: 'Vegetarian',
      description: 'Honeycrisp apple slices with stone-ground cashew butter and a pinch of Ceylon cinnamon.',
      key_nutrients: ['Pectin Fiber', 'Magnesium', 'Steady Glucose'],
      prep_time_min: 3,
      items: [],
    },
  },
];

export const DEMO_CHECKIN: DailyCheckin = {
  id: 'chk-today',
  user_id: 'demo-urjaa-user-001',
  date: new Date().toISOString().split('T')[0],
  bleeding_status: 'no_bleeding',
  mood: 'Great',
  energy: 'High',
  bloating: 'None',
  cramps: 'None',
  sleep: 'Good',
  water_ml: 1500,
  nutrition_adherence: 'Followed',
  notes: 'Felt very energized this morning; ready for creative flow.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function generateDemoCalendar(monthStr?: string): MonthSummary {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = now.getDate();

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === todayDate;
    const isFuture = i > todayDate;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

    let phase: 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal' = 'Follicular';
    let isPeriod = false;

    if (i <= 5) {
      phase = 'Menstrual';
      isPeriod = true;
    } else if (i <= 14) {
      phase = 'Follicular';
    } else if (i <= 17) {
      phase = 'Ovulatory';
    } else {
      phase = 'Luteal';
    }

    days.push({
      date: dateStr,
      day_of_month: i,
      day_of_week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(year, month, i).getDay()],
      is_future: isFuture,
      is_today: isToday,
      cycle_day: i,
      estimated_phase: phase,
      is_period: isPeriod,
      is_estimated_period: false,
      is_ovulation_window: i >= 13 && i <= 16,
      workout_status: isFuture ? 'NONE' : i % 2 === 0 ? 'COMPLETED' : 'NONE',
      workout_title: i % 2 === 0 ? 'Dynamic Kinetic Flow' : undefined,
      workout_minutes: i % 2 === 0 ? 15 : 0,
      nutrition_status: isFuture ? 'Not logged' : 'Followed',
      meals_completed: isFuture ? 0 : 3,
      water_ml: isFuture ? 0 : 1800,
      water_target_ml: 2200,
      water_percentage: isFuture ? 0 : 82,
      mood: isFuture ? undefined : i <= 5 ? 'Okay' : 'Great',
      energy: isFuture ? undefined : i <= 5 ? 'Low' : 'High',
      sleep: isFuture ? undefined : 'Good',
      bloating: isFuture ? undefined : 'None',
      cramps: isFuture ? undefined : i <= 2 ? 'Mild' : 'None',
      checkin_completed: !isFuture,
      consistency_score: isFuture ? 0 : 92,
    });
  }

  return {
    month: `${year}-${String(month + 1).padStart(2, '0')}`,
    days_in_month: daysInMonth,
    days: days as any,
    active_filter: 'all',
    checkin_streak_days: 8,
    workout_streak_days: 4,
    hydration_streak: 6,
    overall_consistency_score: 91,
    supportive_streak_message: 'Your hormonal rhythm and hydration rhythm are harmonizing beautifully.',
  };
}
