export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string | null;
  time_of_day: 'morning' | 'afternoon' | 'evening' | 'anytime';
  occurrence: 'daily' | 'weekly' | 'monthly' | 'weekdays';
  specific_time: string | null;
  specific_day: number | null;
  icon_url: string | null;
  current_streak: number;
  longest_streak: number;
  total_completions: number;
  created_at: string;
  updated_at: string;
  // Computed fields
  completedToday?: boolean;
  pending?: boolean;
  missed?: boolean;
  missedReason?: string;
  lastCompletedAt?: string;
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
