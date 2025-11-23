import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User, Bell, Palette, Download } from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
  const { user, signOut } = useAuth();
  const [theme, setTheme] = useState<'default' | 'midnight'>('default');

  const toggleTheme = () => {
    const newTheme = theme === 'default' ? 'midnight' : 'default';
    setTheme(newTheme);
    
    if (newTheme === 'midnight') {
      document.documentElement.classList.add('theme-midnight');
    } else {
      document.documentElement.classList.remove('theme-midnight');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-secondary mt-1">Manage your preferences</p>
        </div>

        {/* Profile Section */}
        <div className="ios-card space-y-4">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-text-secondary">Name</p>
              <p className="text-text-primary font-medium">
                {user?.user_metadata?.full_name || 'User'}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Email</p>
              <p className="text-text-primary font-medium">
                {user?.email || 'No email'}
              </p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="ios-card space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Preferences</h2>
          
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-bg-800 hover:bg-bg-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-accent" />
              <span className="text-text-primary">Theme</span>
            </div>
            <span className="text-text-secondary text-sm capitalize">{theme}</span>
          </button>

          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-bg-800 hover:bg-bg-700 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-accent" />
              <span className="text-text-primary">Notifications</span>
            </div>
            <span className="text-text-secondary text-sm">Enabled</span>
          </button>

          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-bg-800 hover:bg-bg-700 transition-colors">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-accent" />
              <span className="text-text-primary">Export Data</span>
            </div>
          </button>
        </div>

        {/* Sign Out */}
        <Button
          onClick={signOut}
          variant="destructive"
          className="w-full flex items-center justify-center gap-2 py-6 rounded-xl"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Settings;
