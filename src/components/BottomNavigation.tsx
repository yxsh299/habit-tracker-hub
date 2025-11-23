import { Home, BarChart3, Grid3x3, Settings } from 'lucide-react';

interface BottomNavigationProps {
  currentView: 'dashboard' | 'analytics' | 'habits' | 'settings';
  onNavigate: (view: 'dashboard' | 'analytics' | 'habits' | 'settings') => void;
}

const BottomNavigation = ({ currentView, onNavigate }: BottomNavigationProps) => {
  const navItems = [
    { id: 'dashboard' as const, icon: Home, label: 'Dashboard' },
    { id: 'analytics' as const, icon: BarChart3, label: 'Analytics' },
    { id: 'habits' as const, icon: Grid3x3, label: 'Habits' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="bottom-nav z-50">
      <div className="flex items-center justify-around max-w-2xl mx-auto px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
