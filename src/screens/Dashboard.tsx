import { useState, useEffect } from 'react';
import { Habit } from '@/types';
import HabitCard from '@/components/HabitCard';
import SettingsPanel from '@/components/SettingsPanel';
import MilestoneBadges from '@/components/MilestoneBadges';
import MissedModal from '@/components/MissedModal';
import HeroSection from '@/components/HeroSection';
import AddHabitDialog from '@/components/AddHabitDialog';
import { simulateWebhookComplete, checkDelayedNudge, sendStreakCelebration } from '@/services/whatsappSim';
import { addLogEntry } from '@/services/completionLog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [missedModalOpen, setMissedModalOpen] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [addHabitOpen, setAddHabitOpen] = useState(false);

  const fetchHabits = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check if each habit was completed today
      const today = new Date().toISOString().split('T')[0];
      const habitsWithCompletions = await Promise.all(
        (data || []).map(async (habit) => {
          const { data: completions } = await supabase
            .from('habit_completions')
            .select('*')
            .eq('habit_id', habit.id)
            .eq('status', 'completed')
            .gte('completed_at', `${today}T00:00:00`)
            .lte('completed_at', `${today}T23:59:59`);

          return {
            ...habit,
            time_of_day: habit.time_of_day as 'morning' | 'afternoon' | 'evening' | 'anytime',
            occurrence: habit.occurrence as 'daily' | 'weekly' | 'monthly' | 'weekdays',
            completedToday: (completions?.length || 0) > 0,
          } as Habit;
        })
      );

      setHabits(habitsWithCompletions);
    } catch (error: any) {
      toast({
        title: 'Error fetching habits',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [user]);

  const handleComplete = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || !user) return;

    // Step 1: Set pending state
    setHabits(prev =>
      prev.map(h =>
        h.id === habitId ? { ...h, pending: true } : h
      )
    );

    try {
      // Step 2: Simulate webhook call
      const response = await simulateWebhookComplete(habit.id, habit.name);

      if (response.success) {
        // Step 3: Update habit in database
        const newStreak = habit.current_streak + 1;
        const newLongestStreak = Math.max(habit.longest_streak, newStreak);
        
        const { error: updateError } = await supabase
          .from('habits')
          .update({
            current_streak: newStreak,
            longest_streak: newLongestStreak,
            total_completions: habit.total_completions + 1,
          })
          .eq('id', habitId);

        if (updateError) throw updateError;

        // Log completion
        const { error: completionError } = await supabase
          .from('habit_completions')
          .insert({
            habit_id: habitId,
            user_id: user.id,
            status: 'completed',
            source: 'webhook',
          });

        if (completionError) throw completionError;

        // Update local state
        setHabits(prev =>
          prev.map(h =>
            h.id === habitId
              ? {
                  ...h,
                  completedToday: true,
                  pending: false,
                  current_streak: newStreak,
                  longest_streak: newLongestStreak,
                  total_completions: h.total_completions + 1,
                }
              : h
          )
        );

        // Celebrate milestones
        if (newStreak % 7 === 0) {
          sendStreakCelebration(habit.name, newStreak);
        }

        toast({
          title: 'Habit completed! 🎉',
          description: `${habit.name} - ${newStreak} day streak!`,
        });
      }
    } catch (error: any) {
      console.error('Error completing habit:', error);
      setHabits(prev =>
        prev.map(h =>
          h.id === habitId ? { ...h, pending: false } : h
        )
      );
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete habit. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleMissed = (habitId: string) => {
    setSelectedHabitId(habitId);
    setMissedModalOpen(true);
  };

  const handleMissedSubmit = async (reason: string) => {
    if (!selectedHabitId || !user) return;

    const habit = habits.find(h => h.id === selectedHabitId);
    if (!habit) return;

    try {
      // Update habit in database
      const { error: updateError } = await supabase
        .from('habits')
        .update({
          current_streak: 0,
        })
        .eq('id', selectedHabitId);

      if (updateError) throw updateError;

      // Log missed completion
      const { error: completionError } = await supabase
        .from('habit_completions')
        .insert({
          habit_id: selectedHabitId,
          user_id: user.id,
          status: 'missed',
          source: 'user',
          missed_reason: reason,
        });

      if (completionError) throw completionError;

      // Update local state
      setHabits(prev =>
        prev.map(h =>
          h.id === selectedHabitId
            ? {
                ...h,
                missed: true,
                missedReason: reason,
                current_streak: 0,
              }
            : h
        )
      );

      checkDelayedNudge(habit.id, habit.name, reason);

      toast({
        title: 'Noted',
        description: 'We\'ll help you get back on track tomorrow',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }

    setSelectedHabitId(null);
  };

  const longestStreak = Math.max(...habits.map(h => h.longest_streak), 0);
  const totalCompletions = habits.reduce((sum, h) => sum + h.total_completions, 0);

  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-6 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <HeroSection 
          onAddHabit={() => setAddHabitOpen(true)}
          userName={user?.user_metadata?.full_name}
        />

        <SettingsPanel habits={habits} />
        
        <MilestoneBadges longestStreak={longestStreak} totalCompletions={totalCompletions} />

        {habits.length === 0 ? (
          <div className="text-center py-12 ios-card">
            <p className="text-text-secondary text-lg">
              No habits yet. Click "Add Habit" to get started! 🚀
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onComplete={handleComplete}
                onMissed={handleMissed}
              />
            ))}
          </div>
        )}
      </div>

      <AddHabitDialog
        open={addHabitOpen}
        onOpenChange={setAddHabitOpen}
        onHabitAdded={fetchHabits}
      />

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
