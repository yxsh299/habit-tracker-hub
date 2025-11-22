export const HABITO_CATEGORIES = [
  'MIND',
  'BODY',
  'VITALITY',
  'PRESENCE',
  'GROWTH',
  'RELATIONS',
] as const;

export type HabitoCategory = typeof HABITO_CATEGORIES[number];

export interface PresetHabit {
  title: string;
  description: string;
  time: string;
  occurrence: string;
}

export const FINAL_HABIT_DATA: Record<HabitoCategory, PresetHabit[]> = {
  MIND: [
    {
      title: 'Deep Reading Session',
      description: 'Read a non-fiction book chapter',
      time: 'Daily',
      occurrence: '1 chapter / day',
    },
    {
      title: 'Mindful 10 Minutes',
      description: 'Meditate (10+ minutes)',
      time: 'Daily',
      occurrence: '1 time / day',
    },
    {
      title: 'Language Drill (15m)',
      description: 'Practice a foreign language',
      time: 'Daily',
      occurrence: '15 minutes / day',
    },
    {
      title: 'Skill Building Block',
      description: 'Learn a new skill (e.g., coding, drawing)',
      time: 'Daily',
      occurrence: '30 minutes / day',
    },
    {
      title: 'Evening Tech Shutdown',
      description: 'Digital Detox (1 hour before bed)',
      time: 'Daily',
      occurrence: '1 hour / day',
    },
    {
      title: 'Daily Reflection Log',
      description: 'Journal/Write a reflection',
      time: 'Daily',
      occurrence: '5 minutes / day',
    },
    {
      title: 'Structured Learning Unit',
      description: 'Attend an online course/lecture',
      time: 'Weekly',
      occurrence: '1 lesson / week',
    },
    {
      title: 'Knowledge Podcast',
      description: 'Listen to an educational podcast',
      time: 'Weekly',
      occurrence: '2 episodes / week',
    },
    {
      title: 'Future Vision Practice',
      description: 'Practice visualization (future goals)',
      time: 'Daily',
      occurrence: '5 minutes / day',
    },
  ],
  BODY: [
    {
      title: 'Target Step Count',
      description: 'Walk 10,000 steps',
      time: 'Daily',
      occurrence: '10,000 steps / day',
    },
    {
      title: 'Strength Session',
      description: 'Perform resistance training',
      time: 'Weekly',
      occurrence: '3 times / week',
    },
    {
      title: 'Mobility Flow',
      description: 'Do 20 minutes of stretching/mobility',
      time: 'Daily',
      occurrence: '1 time / day',
    },
    {
      title: 'Cardio Burst',
      description: 'Do a short burst of cardio (HIIT/run)',
      time: 'Weekly',
      occurrence: '3 times / week',
    },
    {
      title: 'Cold Resilience Practice',
      description: 'Do a 5-minute cold exposure (shower/walk)',
      time: 'Daily',
      occurrence: '1 time / day',
    },
    {
      title: 'Core Stability Routine',
      description: 'Do exercises for core strength',
      time: 'Weekly',
      occurrence: '3 times / week',
    },
  ],
  VITALITY: [
    {
      title: 'Daily Hydration Goal',
      description: 'Drink the recommended amount of water',
      time: 'Daily',
      occurrence: '8 x 8 oz glasses / day',
    },
    {
      title: 'Green Intake',
      description: 'Eat a serving of leafy greens',
      time: 'Daily',
      occurrence: '1 time / day',
    },
    {
      title: 'Self-Prepared Lunch',
      description: 'Prepare my own healthy lunch',
      time: 'Weekly',
      occurrence: '5 times / week',
    },
    {
      title: '7+ Hours Sleep Goal',
      description: 'Get 7+ hours of quality sleep',
      time: 'Daily',
      occurrence: '1 time / day',
    },
    {
      title: 'Daily Supplement Stack',
      description: 'Take necessary supplements',
      time: 'Daily',
      occurrence: '1 time / day',
    },
    {
      title: 'No Processed Snacks',
      description: 'Avoid sugar/processed snacks',
      time: 'Daily',
      occurrence: '1 time / day',
    },
    {
      title: 'Full Oral Hygiene',
      description: 'Perform a dental care routine (floss, brush)',
      time: 'Daily',
      occurrence: '2 times / day',
    },
    {
      title: 'Culinary Exploration',
      description: 'Try a new recipe or ingredient',
      time: 'Weekly',
      occurrence: '1 time / week',
    },
    {
      title: 'Caffeine Curfew',
      description: 'Limit caffeine intake after 2 PM',
      time: 'Daily',
      occurrence: '1 time / day',
    },
    {
      title: 'Floss Before Brush',
      description: 'Floss before brushing my teeth',
      time: 'Daily',
      occurrence: '1 time / day',
    },
  ],
  PRESENCE: [
    {
      title: 'Outdoor Sunlight Exposure',
      description: 'Spend 15 minutes in the sun/outdoors',
      time: 'Daily',
      occurrence: '1 time / day',
    },
    {
      title: '5-Minute Observation',
      description: 'Take 5 minutes to just observe my surroundings',
      time: 'Daily',
      occurrence: '1 time / day',
    },
    {
      title: '"One Thing" Declutter',
      description: 'Declutter one small physical area',
      time: 'Daily',
      occurrence: '1 area / day',
    },
  ],
  GROWTH: [
    {
      title: 'Income Stream Research',
      description: 'Investigate 1 new income stream idea',
      time: 'Weekly',
      occurrence: '1 idea / week',
    },
    {
      title: 'Industry Knowledge Update',
      description: 'Read industry news/articles',
      time: 'Daily',
      occurrence: '15 minutes / day',
    },
    {
      title: 'Finance Literacy Read',
      description: 'Read 1 article about personal finance',
      time: 'Weekly',
      occurrence: '1 article / week',
    },
    {
      title: 'Savings Goal Setup',
      description: 'Set a specific short-term savings goal',
      time: 'Monthly',
      occurrence: '1 goal / month',
    },
    {
      title: 'Goal Breakdown & Action',
      description: 'Write down a Big Goal and 1 next step for it',
      time: 'Weekly',
      occurrence: '1 time / week',
    },
  ],
  RELATIONS: [
    {
      title: 'Daily Act of Kindness',
      description: 'Perform 1 act of kindness for a stranger',
      time: 'Daily',
      occurrence: '1 time / day',
    },
    {
      title: 'Meaningful Connection',
      description: 'Contact a friend or family member',
      time: 'Weekly',
      occurrence: '3 times / week',
    },
    {
      title: 'Express Gratitude',
      description: 'Express appreciation to a loved one',
      time: 'Daily',
      occurrence: '1 time / day',
    },
    {
      title: 'Dedicated Partner Time',
      description: 'Spend dedicated, quality time with a partner',
      time: 'Weekly',
      occurrence: '1 session / week',
    },
  ],
};
