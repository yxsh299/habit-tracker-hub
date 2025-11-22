import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Download } from 'lucide-react';
import { Theme } from '@/types';
import { Habit } from '@/types';
import { downloadICSFile } from '@/utils/icsGenerator';
import { useToast } from '@/hooks/use-toast';

interface SettingsPanelProps {
  habits: Habit[];
}

const SettingsPanel = ({ habits }: SettingsPanelProps) => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<Theme>('theme-deep-black');

  useEffect(() => {
    const savedTheme = localStorage.getItem('habito.theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    }
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'theme-deep-black' ? 'theme-midnight' : 'theme-deep-black';
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem('habito.theme', newTheme);
    
    toast({
      title: 'Theme changed',
      description: `Switched to ${newTheme === 'theme-midnight' ? 'Midnight' : 'Deep Black'} theme`,
    });
  };

  const handleExportCalendar = () => {
    if (habits.length === 0) {
      toast({
        title: 'No habits to export',
        description: 'Create some habits first before exporting to calendar',
        variant: 'destructive',
      });
      return;
    }

    downloadICSFile(habits);
    toast({
      title: 'Calendar exported',
      description: `${habits.length} habits exported to your calendar`,
    });
  };

  return (
    <div className="glass-panel p-4 mb-6">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
        Settings
      </h3>
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={toggleTheme}
          variant="outline"
          className="border-border text-text-secondary hover:bg-bg-700 hover:text-text-primary"
          size="sm"
        >
          {theme === 'theme-deep-black' ? (
            <>
              <Moon className="w-4 h-4 mr-2" />
              Midnight Theme
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 mr-2" />
              Deep Black
            </>
          )}
        </Button>

        <Button
          onClick={handleExportCalendar}
          variant="outline"
          className="border-border text-text-secondary hover:bg-bg-700 hover:text-text-primary"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Export to Calendar
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
