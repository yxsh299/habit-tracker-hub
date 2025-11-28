import { Habit } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  habit: Habit;
  onStart: (habitId: string) => void;
  onComplete: (habitId: string) => void;
  isActive?: boolean;
}

const TaskCard = ({ habit, onStart, onComplete, isActive }: TaskCardProps) => {
  const timeDisplay = habit.specific_time 
    ? new Date(`2000-01-01T${habit.specific_time}`).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      })
    : habit.time_of_day;

  return (
    <Card
      className={cn(
        "min-w-[240px] flex-shrink-0 bg-card border-border p-4 rounded-2xl transition-all duration-200",
        isActive && "border-accent shadow-glow",
        habit.completedToday && "opacity-50"
      )}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-text-primary truncate">
              {habit.name}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-text-secondary">
              <Clock className="w-3 h-3" />
              <span className="capitalize">{timeDisplay}</span>
            </div>
          </div>
          {habit.icon_url && (
            <img 
              src={habit.icon_url} 
              alt={habit.name} 
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0" 
            />
          )}
        </div>

        {/* Category Badge */}
        {habit.category && (
          <div className="flex">
            <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-lg">
              {habit.category}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        {!habit.completedToday ? (
          <div className="flex gap-2">
            <Button
              onClick={() => onStart(habit.id)}
              variant="outline"
              size="sm"
              className="flex-1 border-border hover:bg-bg-700"
              disabled={isActive}
            >
              <Play className="w-3 h-3 mr-1" />
              Start
            </Button>
            <Button
              onClick={() => onComplete(habit.id)}
              size="sm"
              className="flex-1 bg-accent hover:bg-accent-hover"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Done
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1 text-accent text-sm py-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;
