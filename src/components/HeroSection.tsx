import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onAddHabit: () => void;
  userName?: string;
}

const HeroSection = ({ onAddHabit, userName }: HeroSectionProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Card className="bg-gradient-to-br from-accent/20 via-bg-800 to-bg-800 border-accent/20 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <p className="text-sm text-text-secondary font-medium">
                {getGreeting()}{userName ? `, ${userName}` : ''}
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
              Ready to build better habits?
            </h1>
            <p className="text-text-secondary text-base md:text-lg max-w-2xl">
              Track your progress, build streaks, and transform your life one habit at a time.
              Start by adding your first habit or choose from our curated collection.
            </p>
          </div>
          
          <Button
            onClick={onAddHabit}
            size="lg"
            className="bg-accent hover:bg-accent-hover text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Habit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroSection;
