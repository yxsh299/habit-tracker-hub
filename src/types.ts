export interface Habit {
  id: string;
  name: string;
  description: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  occurrence: 'daily' | 'weekly' | 'weekdays';
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  totalCompletions: number;
  createdAt: string;
  lastCompletedAt?: string;
  pending?: boolean;
  missed?: boolean;
  missedReason?: string;
}

export interface LogRecord {
  timestamp: string;
  habitId: string;
  habitName: string;
  status: 'created' | 'completed' | 'missed' | 'pending';
  source: 'user' | 'webhook';
  metadata?: {
    reason?: string;
    streakDays?: number;
    timeOfDay?: string;
  };
}

export interface AnalyticsData {
  totalCompletions: number;
  currentStreak: number;
  successRate: number;
  timeOfDayBreakdown: {
    morning: number;
    afternoon: number;
    evening: number;
    anytime: number;
  };
  obstacleBreakdown: Record<string, number>;
  dailySuccessRate: Array<{ date: string; rate: number }>;
}

export type TimeRange = '7d' | '30d' | '90d' | 'all';

export type Theme = 'theme-deep-black' | 'theme-midnight';
