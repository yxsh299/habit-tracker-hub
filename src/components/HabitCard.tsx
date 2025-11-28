import { Habit } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Flame, Sunrise, Sun, Moon, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onComplete: (habitId: string) => void;
  onMissed: (habitId: string) => void;
  onClick?: (habit: Habit) => void;
}

const HabitCard = ({ habit, onComplete, onMissed, onClick }: HabitCardProps) => {
  const getTimeOfDayIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'morning':
        return <Sunrise className="w-4 h-4 text-accent" />;
      case 'afternoon':
        return <Sun className="w-4 h-4 text-accent" />;
      case 'evening':
        return <Moon className="w-4 h-4 text-accent" />;
      default:
        return <Clock className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <Card
      className={cn(
        'bg-bg-800 border-border transition-all duration-200 cursor-pointer hover:border-accent/30',
        habit.completedToday && 'border-accent/50 bg-accent/5',
        habit.pending && 'opacity-70 pointer-events-none',
        habit.missed && 'border-warning/50 bg-warning/5'
      )}
      onClick={() => onClick?.(habit)}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-text-primary">{habit.name}</CardTitle>
            <CardDescription className="text-text-secondary">{habit.description}</CardDescription>
          </div>
          {habit.icon_url && (
            <img src={habit.icon_url} alt={habit.name} className="w-10 h-10 rounded-lg object-cover" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Streak Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-accent" />
            <span className="text-text-secondary">Current Streak:</span>
            <span className="font-bold text-accent">{habit.current_streak} days</span>
          </div>
          <div className="text-text-secondary">
            Best: <span className="font-semibold text-text-primary">{habit.longest_streak}</span>
          </div>
        </div>

        {/* Time of Day Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          {getTimeOfDayIcon(habit.time_of_day)}
          <span className="text-xs text-text-secondary capitalize">{habit.time_of_day}</span>
          <span className="text-xs text-text-secondary">•</span>
          <span className="text-xs text-text-secondary capitalize">{habit.occurrence}</span>
          {habit.category && (
            <>
              <span className="text-xs text-text-secondary">•</span>
              <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">{habit.category}</span>
            </>
          )}
        </div>

        {/* Pending State */}
        {habit.pending && (
          <div className="flex items-center gap-2 text-accent text-sm font-medium">
            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            Processing...
          </div>
        )}

        {/* Missed State */}
        {habit.missed && habit.missedReason && (
          <div className="p-2 bg-warning/10 border border-warning/30 rounded text-sm text-warning">
            Missed: {habit.missedReason}
          </div>
        )}

        {/* Action Buttons */}
        {!habit.completedToday && !habit.pending && !habit.missed && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onComplete(habit.id);
              }}
              className="flex-1 bg-accent hover:bg-accent-hover text-accent-foreground"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Done
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onMissed(habit.id);
              }}
              variant="outline"
              size="icon"
              className="border-border text-text-secondary hover:bg-bg-700 hover:text-text-primary"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Completed State */}
        {habit.completedToday && (
          <div className="flex items-center justify-center gap-2 text-accent font-medium py-2">
            <CheckCircle2 className="w-5 h-5" />
            Completed today! 🎉
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitCard;
