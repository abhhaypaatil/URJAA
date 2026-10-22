import { PhaseType, DailyCheckin, CompanionMessage } from '../types';

export interface CompanionContext {
  userName: string;
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
    userName: 'Voyager',
    phase: 'Follicular',
    cycleDay: 9,
    energyLevel: 'High',
    mood: 'Great',
    symptoms: [],
    hydrationML: 1500,
    hydrationTargetML: 2200,
  };

  /**
   * Generates a context-aware response based on the user's question and current biological rhythm.
   */
  public static async query(
    userText: string,
    context: Partial<CompanionContext> = {}
  ): Promise<CompanionMessage> {
    const ctx = { ...this.defaultContext, ...context };
    const queryLower = userText.toLowerCase();

    // Simulate realistic thought synthesis duration (300-600ms)
    await new Promise((r) => setTimeout(r, 450));

    let replyText = '';
    let suggestedActions: CompanionMessage['suggestedActions'] = [];

    if (queryLower.includes('phase') || queryLower.includes('cycle') || queryLower.includes('follicular') || queryLower.includes('menstrual')) {
      replyText = `You are currently on Day ${ctx.cycleDay} of your **${ctx.phase} Phase**. During this window, estradiol and FSH levels support enhanced recovery, energy, and muscle endurance. It's a great time for progressive strength work or creative projects.`;
      suggestedActions = [
        { label: 'View Cycle Details', route: '/cycle' },
        { label: 'View Today’s Workout', route: '/workout' },
      ];
    } else if (queryLower.includes('workout') || queryLower.includes('exercise') || queryLower.includes('train') || queryLower.includes('move')) {
      replyText = `Given your **${ctx.phase} Phase** and **${ctx.energyLevel || 'Moderate'} Energy**, your body is primed for dynamic movements without joint strain. Today’s recommended session is **Follicular Dynamic Energizer (15 min)**—low-impact and invigorating.`;
      suggestedActions = [
        { label: 'Start Workout', route: '/workout' },
        { label: 'Adjust Intensity', route: '/workout' },
      ];
    } else if (queryLower.includes('food') || queryLower.includes('nutrition') || queryLower.includes('eat') || queryLower.includes('meal') || queryLower.includes('snack')) {
      replyText = `For the **${ctx.phase} Phase**, your body benefits from fresh colorful vegetables, sprouted grains, lean protein, and healthy fats. Today’s highlight is the **Quinoa Edamame & Rainbow Crunch Bowl**.`;
      suggestedActions = [
        { label: 'View Meal Plan', route: '/nutrition' },
        { label: 'Check 1-Tap Swaps', route: '/nutrition' },
      ];
    } else if (queryLower.includes('cramp') || queryLower.includes('bloat') || queryLower.includes('pain') || queryLower.includes('relief')) {
      replyText = `When experiencing cramps or bloating, prioritize gentle diaphragmatic breathing and pelvic release. Warm ginger-chamomile tea, magnesium-rich foods, and a 5-minute child’s pose can help ease uterine contractions.`;
      suggestedActions = [
        { label: 'Gentle Recovery Stretch', route: '/workout' },
        { label: 'Log Symptoms in Check-in', route: '/check-in' },
      ];
    } else if (queryLower.includes('water') || queryLower.includes('hydrate') || queryLower.includes('hydration')) {
      const remaining = Math.max(0, (ctx.hydrationTargetML || 2200) - (ctx.hydrationML || 0));
      replyText = `You’ve logged **${ctx.hydrationML} ml** of your **${ctx.hydrationTargetML} ml** goal (${remaining} ml remaining). Good hydration supports estrogen metabolism and reduces late-day fatigue.`;
      suggestedActions = [
        { label: 'Log Water Intake', route: '/check-in' },
      ];
    } else if (queryLower.includes('breathe') || queryLower.includes('meditat') || queryLower.includes('calm') || queryLower.includes('relax')) {
      replyText = `Take a deep breath with me: Inhale gently through your nose for 4 seconds... pause for 4... and exhale softly for 6 seconds. Releasing tension on your exhale stimulates the vagus nerve and eases stress.`;
      suggestedActions = [
        { label: 'Start Recovery Session', route: '/workout' },
      ];
    } else {
      replyText = `Hi ${ctx.userName}! Today your wellness tracking shows **${ctx.energyLevel || 'balanced'} energy** in the **${ctx.phase} Phase**. Would you like to review today's workout, explore meal ideas, or complete your 20-second check-in?`;
      suggestedActions = [
        { label: 'Daily Check-in', route: '/check-in' },
        { label: 'Today’s Workout', route: '/workout' },
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
      'What workout fits my energy today?',
      'Suggest a micronutrient-rich snack for today',
      'Guide me through a 60-second breathing reset',
      'How does hydration affect my hormonal balance?',
    ];
  }
}
