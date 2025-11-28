import { useState, useEffect } from 'react';
import { Habit } from '@/types';
import HabitCard from '@/components/HabitCard';
import HabitTemplates, { HabitTemplate } from '@/components/HabitTemplates';
import AddHabitDialog from '@/components/AddHabitDialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const YourHabits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
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
    // Add completion logic here
  };

  const handleMissed = async (habitId: string) => {
    // Add missed logic here
  };

  const handleSelectTemplate = async (template: HabitTemplate) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('habits').insert({
        user_id: user.id,
        name: template.name,
        description: template.description,
        category: template.category,
        time_of_day: template.time_of_day,
        occurrence: 'daily',
      });

      if (error) throw error;

      toast({
        title: 'Habit created! 🎉',
        description: `${template.name} has been added to your habits`,
      });

      fetchHabits();
    } catch (error: any) {
      toast({
        title: 'Error creating habit',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Your Habits</h1>
            <p className="text-text-secondary mt-1">Manage all your habits</p>
          </div>
          <Button
            onClick={() => setAddHabitOpen(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Habit Templates */}
        <HabitTemplates onSelectTemplate={handleSelectTemplate} />

        {/* User's Habits */}
        {habits.length === 0 ? (
          <div className="text-center py-12 ios-card">
            <p className="text-text-secondary text-lg">
              No habits yet. Select a template or create your first habit! 🚀
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary">Your Habits</h2>
            <div className="grid gap-4">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={handleComplete}
                  onMissed={handleMissed}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <AddHabitDialog
        open={addHabitOpen}
        onOpenChange={setAddHabitOpen}
        onHabitAdded={fetchHabits}
      />
    </div>
  );
};

export default YourHabits;
