import { PhaseType, DailyCheckin, CompanionMessage } from '../types';
import { MEDICAL_DISCLAIMER } from '../constants';

export interface CompanionContext {
  userName: string;
  companionName?: string;
  personalityTone?: 'Gentle & Nurturing' | 'Mindful & Grounded' | 'Direct & Motivating' | string;
  primaryGoal?: string;
  dietaryPreference?: string;
  phase: PhaseType;
  cycleDay: number;
  energyLevel?: string;
  mood?: string;
  symptoms?: string[];
  hydrationML?: number;
  hydrationTargetML?: number;
}

export class AICompanionService {
  private static defaultContext: CompanionContext = {
    userName: 'Friend',
    companionName: 'Aura',
    personalityTone: 'Gentle & Nurturing',
    primaryGoal: 'Build strength',
    dietaryPreference: 'Vegetarian',
    phase: 'Follicular',
    cycleDay: 9,
    energyLevel: 'High',
    mood: 'Great',
    symptoms: [],
    hydrationML: 1500,
    hydrationTargetML: 2200,
  };

  /**
   * Generates a context-aware response based on the user's question, current biological rhythm,
   * custom companion persona, and selected supportive tone.
   */
  public static async query(
    userText: string,
    context: Partial<CompanionContext> = {}
  ): Promise<CompanionMessage> {
    const ctx = { ...this.defaultContext, ...context };
    const queryLower = userText.toLowerCase();
    const companion = ctx.companionName || 'Aura';
    const tone = ctx.personalityTone || 'Gentle & Nurturing';

    // Simulate realistic thought synthesis duration (300-550ms)
    await new Promise((r) => setTimeout(r, 450));

    let replyText = '';
    let suggestedActions: CompanionMessage['suggestedActions'] = [];

    // Tone prefix styling
    const tonePrefix =
      tone === 'Mindful & Grounded'
        ? 'Taking a slow breath together... '
        : tone === 'Direct & Motivating'
        ? "Let's align your power! "
        : 'Holding space for you today. ';

    const goalSnippet = ctx.primaryGoal
      ? ` Working towards **${ctx.primaryGoal}**:`
      : '';

    if (
      queryLower.includes('phase') ||
      queryLower.includes('cycle') ||
      queryLower.includes('follicular') ||
      queryLower.includes('menstrual') ||
      queryLower.includes('luteal') ||
      queryLower.includes('ovulat')
    ) {
      replyText = `${tonePrefix}You are currently on Day ${ctx.cycleDay} of your **${ctx.phase} Phase**. During this window, estrogen gently supports cellular stamina and cognitive focus.${goalSnippet} it's an optimal time for progressive strength work, joyful movement, and lean nutrient absorption.`;
      suggestedActions = [
        { label: 'View Cycle Details', route: '/cycle' },
        { label: 'View Today’s Workout', route: '/workout' },
      ];
    } else if (
      queryLower.includes('workout') ||
      queryLower.includes('exercise') ||
      queryLower.includes('train') ||
      queryLower.includes('move') ||
      queryLower.includes('stretch')
    ) {
      replyText = `${tonePrefix}Given your **${ctx.phase} Phase** and **${
        ctx.energyLevel || 'balanced'
      } energy**, your neuromuscular coordination is strong.${goalSnippet} Today’s recommended session features gentle compound movement with avatar form cues—paced without joint strain or cortisol spikes.`;
      suggestedActions = [
        { label: 'Start Workout', route: '/workout' },
        { label: 'Adjust Intensity', route: '/workout' },
      ];
    } else if (
      queryLower.includes('food') ||
      queryLower.includes('nutrition') ||
      queryLower.includes('eat') ||
      queryLower.includes('meal') ||
      queryLower.includes('snack') ||
      queryLower.includes('recipe') ||
      queryLower.includes('diet')
    ) {
      const isVeg = !ctx.dietaryPreference || ctx.dietaryPreference.toLowerCase().includes('veg');
      const mealSuggestion = isVeg
        ? 'Steamed Idli Sambar with coconut chutney or Sprouted Moong Chaat'
        : 'Homestyle Chicken Curry with brown rice or Tawa Grilled Fish with warm roti';
      replyText = `${tonePrefix}For your **${ctx.phase} Phase**, your body thrives on comforting, nutrient-dense regional meals. We recommend **${mealSuggestion}**—rich in bioavailable protein, iron, and fiber with 1-tap swaps available.`;
      suggestedActions = [
        { label: 'View Indian Meal Plan', route: '/nutrition' },
        { label: 'Check 1-Tap Swaps', route: '/nutrition' },
      ];
    } else if (
      queryLower.includes('cramp') ||
      queryLower.includes('bloat') ||
      queryLower.includes('pain') ||
      queryLower.includes('symptom') ||
      queryLower.includes('relief')
    ) {
      replyText = `${tonePrefix}If you’re feeling physical tension or cramps, please be gentle with your body. Diaphragmatic breathing, a warm ajwain or chamomile infusion, a heated compress, and resting in child's pose can release pelvic floor tension.`;
      suggestedActions = [
        { label: 'Gentle Recovery Stretch', route: '/workout' },
        { label: 'Log Symptoms in Check-in', route: '/check-in' },
      ];
    } else if (
      queryLower.includes('water') ||
      queryLower.includes('hydrate') ||
      queryLower.includes('hydration')
    ) {
      const current = ctx.hydrationML || 0;
      const target = ctx.hydrationTargetML || 2200;
      const remaining = Math.max(0, target - current);
      replyText = `${tonePrefix}You have logged **${current} ml** toward your **${target} ml** daily hydration intention (${remaining} ml remaining). Staying hydrated directly supports hormone transport and smooth cellular energy.`;
      suggestedActions = [{ label: 'Log Water Intake', route: '/check-in' }];
    } else if (
      queryLower.includes('breathe') ||
      queryLower.includes('meditat') ||
      queryLower.includes('calm') ||
      queryLower.includes('relax') ||
      queryLower.includes('stress')
    ) {
      replyText = `${tonePrefix}Let’s center together. Inhale softly through your nose for 4 seconds... hold gently for 4... and exhale smoothly for 6 seconds. Lengthening your exhale sends a direct safety signal through your vagus nerve.`;
      suggestedActions = [{ label: 'Start Restorative Flow', route: '/workout' }];
    } else {
      replyText = `Hello ${ctx.userName || 'friend'}! I'm ${companion}. Today your rhythm shows **${
        ctx.energyLevel || 'balanced'
      } energy** in your **${ctx.phase} Phase**.${goalSnippet} Would you like to review today's movement session, explore hormone-supportive Indian meals, or complete your 20-second check-in?`;
      suggestedActions = [
        { label: 'Daily Check-in', route: '/check-in' },
        { label: 'Today’s Movement', route: '/workout' },
        { label: 'Explore Nutrition', route: '/nutrition' },
      ];
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'companion',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions,
      phaseContext: ctx.phase,
    };
  }

  public static getSuggestedPrompts(phase: PhaseType = 'Follicular'): string[] {
    return [
      `What should I focus on in my ${phase} phase?`,
      'What movement session fits my energy today?',
      'Suggest an Indian meal recipe for today',
      'Guide me through a 2-minute restorative breath',
    ];
  }
}
