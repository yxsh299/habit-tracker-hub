interface WebhookResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export const simulateWebhookComplete = async (
  habitId: string,
  habitName: string
): Promise<WebhookResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

  // Simulate successful webhook response
  return {
    success: true,
    message: `Habit "${habitName}" marked complete via webhook`,
    timestamp: new Date().toISOString(),
  };
};

export const checkDelayedNudge = async (
  habitId: string,
  habitName: string,
  missedReason: string
): Promise<void> => {
  // Simulate scheduling a delayed nudge
  await new Promise(resolve => setTimeout(resolve, 300));
  
  console.log(`[WhatsApp Sim] Scheduled nudge for "${habitName}" - Reason: ${missedReason}`);
};

export const sendDailySummary = async (
  completedCount: number,
  totalCount: number
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`[WhatsApp Sim] Daily summary sent: ${completedCount}/${totalCount} habits completed`);
};

export const sendStreakCelebration = async (
  habitName: string,
  streakDays: number
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  console.log(`[WhatsApp Sim] Streak celebration for "${habitName}": ${streakDays} days! 🎉`);
};
