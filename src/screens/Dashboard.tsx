import { useState } from 'react';
import { Habit } from '@/types';
import HabitCard from '@/components/HabitCard';
import SettingsPanel from '@/components/SettingsPanel';
import MilestoneBadges from '@/components/MilestoneBadges';
import MissedModal from '@/components/MissedModal';
import { simulateWebhookComplete, checkDelayedNudge, sendStreakCelebration } from '@/services/whatsappSim';
import { addLogEntry } from '@/services/completionLog';
import { useToast } from '@/hooks/use-toast';

const sampleHabits: Habit[] = [
  {
    id: 'h1',
    name: 'Morning Meditation',
    description: '10 minutes of mindfulness practice',
    timeOfDay: 'morning',
    occurrence: 'daily',
    currentStreak: 12,
    longestStreak: 28,
    completedToday: false,
    totalCompletions: 45,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'h2',
    name: 'Read for 30min',
    description: 'Non-fiction or learning material',
    timeOfDay: 'evening',
    occurrence: 'daily',
    currentStreak: 5,
    longestStreak: 15,
    completedToday: false,
    totalCompletions: 32,
    createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'h3',
    name: 'Exercise',
    description: '30 minutes workout or yoga',
    timeOfDay: 'morning',
    occurrence: 'weekdays',
    currentStreak: 8,
    longestStreak: 22,
    completedToday: false,
    totalCompletions: 56,
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'h4',
    name: 'Gratitude Journal',
    description: 'Write 3 things you\'re grateful for',
    timeOfDay: 'evening',
    occurrence: 'daily',
    currentStreak: 3,
    longestStreak: 10,
    completedToday: false,
    totalCompletions: 18,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const Dashboard = () => {
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>(sampleHabits);
  const [missedModalOpen, setMissedModalOpen] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  const handleComplete = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    // Step 1: Set pending state
    setHabits(prev =>
      prev.map(h =>
        h.id === habitId ? { ...h, pending: true } : h
      )
    );

    // Log pending state
    addLogEntry({
      timestamp: new Date().toISOString(),
      habitId: habit.id,
      habitName: habit.name,
      status: 'pending',
      source: 'user',
    });

    try {
      // Step 2: Simulate webhook call
      const response = await simulateWebhookComplete(habit.id, habit.name);

      if (response.success) {
        // Step 3: Update habit on success
        const newStreak = habit.currentStreak + 1;
        const newLongestStreak = Math.max(habit.longestStreak, newStreak);
        
        setHabits(prev =>
          prev.map(h =>
            h.id === habitId
              ? {
                  ...h,
                  completedToday: true,
                  pending: false,
                  currentStreak: newStreak,
                  longestStreak: newLongestStreak,
                  totalCompletions: h.totalCompletions + 1,
                  lastCompletedAt: new Date().toISOString(),
                }
              : h
          )
        );

        // Log completion
        addLogEntry({
          timestamp: new Date().toISOString(),
          habitId: habit.id,
          habitName: habit.name,
          status: 'completed',
          source: 'webhook',
          metadata: {
            streakDays: newStreak,
            timeOfDay: habit.timeOfDay,
          },
        });

        // Celebrate milestones
        if (newStreak % 7 === 0) {
          sendStreakCelebration(habit.name, newStreak);
        }

        toast({
          title: 'Habit completed! 🎉',
          description: `${habit.name} - ${newStreak} day streak!`,
        });
      }
    } catch (error) {
      console.error('Webhook error:', error);
      setHabits(prev =>
        prev.map(h =>
          h.id === habitId ? { ...h, pending: false } : h
        )
      );
      
      toast({
        title: 'Error',
        description: 'Failed to complete habit. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleMissed = (habitId: string) => {
    setSelectedHabitId(habitId);
    setMissedModalOpen(true);
  };

  const handleMissedSubmit = (reason: string) => {
    if (!selectedHabitId) return;

    const habit = habits.find(h => h.id === selectedHabitId);
    if (!habit) return;

    setHabits(prev =>
      prev.map(h =>
        h.id === selectedHabitId
          ? {
              ...h,
              missed: true,
              missedReason: reason,
              currentStreak: 0,
            }
          : h
      )
    );

    addLogEntry({
      timestamp: new Date().toISOString(),
      habitId: habit.id,
      habitName: habit.name,
      status: 'missed',
      source: 'user',
      metadata: {
        reason,
      },
    });

    checkDelayedNudge(habit.id, habit.name, reason);

    toast({
      title: 'Noted',
      description: 'We\'ll help you get back on track tomorrow',
    });

    setSelectedHabitId(null);
  };

  const longestStreak = Math.max(...habits.map(h => h.longestStreak), 0);
  const totalCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0);

  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  return (
    <div className="min-h-screen relative z-10 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Habito</h1>
          <p className="text-text-secondary">Your daily habits, tracked with care</p>
        </header>

        <SettingsPanel habits={habits} />
        
        <MilestoneBadges longestStreak={longestStreak} totalCompletions={totalCompletions} />

        <div className="grid gap-4 md:grid-cols-2">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onComplete={handleComplete}
              onMissed={handleMissed}
            />
          ))}
        </div>
      </div>

      {selectedHabit && (
        <MissedModal
          isOpen={missedModalOpen}
          onClose={() => {
            setMissedModalOpen(false);
            setSelectedHabitId(null);
          }}
          onSubmit={handleMissedSubmit}
          habitName={selectedHabit.name}
        />
      )}
    </div>
  );
};

export default Dashboard;
