import { Habit } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Flame, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onComplete: (habitId: string) => void;
  onMissed: (habitId: string) => void;
}

const HabitCard = ({ habit, onComplete, onMissed }: HabitCardProps) => {
  const getTimeIcon = () => {
    switch (habit.timeOfDay) {
      case 'morning':
        return '🌅';
      case 'afternoon':
        return '☀️';
      case 'evening':
        return '🌙';
      default:
        return '⏰';
    }
  };

  return (
    <div
      className={cn(
        'habit-card',
        habit.completedToday && 'border-accent/50 bg-accent/5',
        habit.pending && 'opacity-70 pointer-events-none',
        habit.missed && 'border-warning/50 bg-warning/5'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{getTimeIcon()}</span>
            <h3 className="text-lg font-semibold text-text-primary">{habit.name}</h3>
          </div>
          <p className="text-sm text-text-secondary">{habit.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1 text-text-muted">
          <Flame className="w-4 h-4 text-accent" />
          <span>{habit.currentStreak} day streak</span>
        </div>
        <div className="flex items-center gap-1 text-text-muted">
          <Clock className="w-4 h-4" />
          <span className="capitalize">{habit.occurrence}</span>
        </div>
      </div>

      {habit.pending && (
        <div className="flex items-center gap-2 text-warning text-sm font-medium">
          <div className="w-4 h-4 border-2 border-warning border-t-transparent rounded-full animate-spin" />
          Processing...
        </div>
      )}

      {habit.missed && habit.missedReason && (
        <div className="mb-3 p-2 bg-warning/10 border border-warning/30 rounded text-sm text-warning">
          Missed: {habit.missedReason}
        </div>
      )}

      {!habit.completedToday && !habit.pending && !habit.missed && (
        <div className="flex gap-2">
          <Button
            onClick={() => onComplete(habit.id)}
            className="flex-1 btn-success"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Done
          </Button>
          <Button
            onClick={() => onMissed(habit.id)}
            variant="outline"
            className="border-border text-text-secondary hover:bg-bg-700 hover:text-text-primary"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      )}

      {habit.completedToday && (
        <div className="flex items-center gap-2 text-accent font-medium">
          <CheckCircle2 className="w-5 h-5" />
          Completed today! 🎉
        </div>
      )}
    </div>
  );
};

export default HabitCard;
