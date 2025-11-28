import { Habit } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, TrendingUp, Flame, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface HabitDetailModalProps {
  habit: Habit | null;
  open: boolean;
  onClose: () => void;
}

const HabitDetailModal = ({ habit, open, onClose }: HabitDetailModalProps) => {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<boolean[]>(new Array(7).fill(false));
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    if (habit && user && open) {
      fetchWeeklyData();
      calculateCompletionRate();
    }
  }, [habit, user, open]);

  const fetchWeeklyData = async () => {
    if (!habit || !user) return;

    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const { data } = await supabase
      .from('habit_completions')
      .select('completed_at, status')
      .eq('habit_id', habit.id)
      .eq('user_id', user.id)
      .gte('completed_at', weekAgo.toISOString())
      .lte('completed_at', today.toISOString());

    const weekly = new Array(7).fill(false);
    data?.forEach(completion => {
      const dayOfWeek = new Date(completion.completed_at).getDay();
      if (completion.status === 'completed') {
        weekly[dayOfWeek] = true;
      }
    });
    setWeeklyData(weekly);
  };

  const calculateCompletionRate = async () => {
    if (!habit || !user) return;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data } = await supabase
      .from('habit_completions')
      .select('status')
      .eq('habit_id', habit.id)
      .eq('user_id', user.id)
      .gte('completed_at', thirtyDaysAgo.toISOString());

    if (data && data.length > 0) {
      const completed = data.filter(d => d.status === 'completed').length;
      const rate = Math.round((completed / 30) * 100);
      setCompletionRate(rate);
    }
  };

  if (!habit) return null;

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const createdDate = new Date(habit.created_at).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-text-primary mb-2">
                {habit.name}
              </DialogTitle>
              {habit.description && (
                <p className="text-text-secondary text-sm">{habit.description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Schedule Info */}
          <div className="flex items-center gap-2 text-text-secondary">
            <Clock className="w-4 h-4" />
            <span className="text-sm capitalize">
              {habit.occurrence} {habit.specific_time && `at ${habit.specific_time}`}
            </span>
          </div>

          {/* Total Repetitions */}
          <div className="ios-card">
            <p className="text-text-secondary text-sm mb-1">Total repetitions</p>
            <p className="text-xs text-text-muted mb-2">Since {createdDate}</p>
            <div className="text-5xl font-bold text-text-primary mb-4">
              {habit.total_completions}
            </div>

            {/* Weekly Calendar */}
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-2">
                {daysOfWeek.map((day, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-xs text-text-secondary mb-1">{day}</p>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        weeklyData[idx] ? 'bg-accent' : 'bg-bg-700'
                      }`}
                    >
                      {weeklyData[idx] && (
                        <div className="w-2 h-2 bg-accent-foreground rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="ios-card">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <p className="text-text-secondary text-sm">Completion rate</p>
              </div>
              <div className="text-3xl font-bold text-text-primary">
                {completionRate}%
              </div>
              <p className="text-xs text-text-muted mt-1">Avg. this month</p>
            </div>

            <div className="ios-card">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-accent" />
                <p className="text-text-secondary text-sm">Longest streak</p>
              </div>
              <div className="text-3xl font-bold text-text-primary">
                {habit.longest_streak}
              </div>
              <p className="text-xs text-text-muted mt-1">days in a row</p>
            </div>
          </div>

          {/* Category Badge */}
          {habit.category && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-text-secondary" />
              <span className="text-xs bg-accent/20 text-accent px-3 py-1 rounded-lg capitalize">
                {habit.category}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HabitDetailModal;
