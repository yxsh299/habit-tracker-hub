import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Dumbbell, Brain, Heart, Sparkles, Book, Coffee, Moon, Sunrise, Target, Smile } from 'lucide-react';

interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  time_of_day: 'morning' | 'afternoon' | 'evening' | 'anytime';
  icon: React.ReactNode;
  color: string;
}

const habitTemplates: HabitTemplate[] = [
  {
    id: 'morning-workout',
    name: 'Morning Workout',
    description: '30 minutes of exercise to start your day',
    category: 'fitness',
    time_of_day: 'morning',
    icon: <Dumbbell className="w-5 h-5" />,
    color: 'hsl(142, 76%, 36%)',
  },
  {
    id: 'meditation',
    name: 'Meditation',
    description: '10 minutes of mindfulness practice',
    category: 'peace of mind',
    time_of_day: 'morning',
    icon: <Heart className="w-5 h-5" />,
    color: 'hsl(280, 70%, 60%)',
  },
  {
    id: 'deep-work',
    name: 'Deep Work Session',
    description: 'Focused work without distractions',
    category: 'productivity',
    time_of_day: 'morning',
    icon: <Brain className="w-5 h-5" />,
    color: 'hsl(217, 91%, 60%)',
  },
  {
    id: 'read-book',
    name: 'Read a Book',
    description: '20 pages of reading for personal growth',
    category: 'growth',
    time_of_day: 'evening',
    icon: <Book className="w-5 h-5" />,
    color: 'hsl(38, 92%, 50%)',
  },
  {
    id: 'gratitude-journal',
    name: 'Gratitude Journal',
    description: 'Write 3 things you\'re grateful for',
    category: 'peace of mind',
    time_of_day: 'evening',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'hsl(50, 90%, 60%)',
  },
  {
    id: 'hydration',
    name: 'Drink Water',
    description: '8 glasses throughout the day',
    category: 'fitness',
    time_of_day: 'anytime',
    icon: <Coffee className="w-5 h-5" />,
    color: 'hsl(200, 80%, 55%)',
  },
  {
    id: 'evening-walk',
    name: 'Evening Walk',
    description: '15-minute walk to wind down',
    category: 'fitness',
    time_of_day: 'evening',
    icon: <Moon className="w-5 h-5" />,
    color: 'hsl(260, 60%, 60%)',
  },
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    description: 'Complete your morning rituals',
    category: 'productivity',
    time_of_day: 'morning',
    icon: <Sunrise className="w-5 h-5" />,
    color: 'hsl(30, 90%, 60%)',
  },
  {
    id: 'goal-review',
    name: 'Review Goals',
    description: 'Check progress on your goals',
    category: 'growth',
    time_of_day: 'afternoon',
    icon: <Target className="w-5 h-5" />,
    color: 'hsl(0, 72%, 51%)',
  },
  {
    id: 'social-connection',
    name: 'Connect with Loved Ones',
    description: 'Reach out to family or friends',
    category: 'peace of mind',
    time_of_day: 'anytime',
    icon: <Smile className="w-5 h-5" />,
    color: 'hsl(340, 82%, 62%)',
  },
];

interface HabitTemplatesProps {
  onSelectTemplate: (template: HabitTemplate) => void;
}

const HabitTemplates = ({ onSelectTemplate }: HabitTemplatesProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">Habit Templates</h2>
        <p className="text-text-secondary text-sm">Quick start with popular habits</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {habitTemplates.map((template) => (
          <Card
            key={template.id}
            className="bg-card border-border hover:border-accent/50 transition-all cursor-pointer group"
            onClick={() => onSelectTemplate(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${template.color}20`, color: template.color }}
                    >
                      {template.icon}
                    </div>
                    <CardTitle className="text-base text-text-primary">
                      {template.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {template.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-lg capitalize">
                    {template.category}
                  </span>
                  <span className="text-xs bg-bg-700 text-text-secondary px-2 py-1 rounded-lg capitalize">
                    {template.time_of_day}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="group-hover:bg-accent group-hover:text-accent-foreground transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template);
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HabitTemplates;
export type { HabitTemplate };
