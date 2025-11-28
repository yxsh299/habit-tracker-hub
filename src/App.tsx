import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BackgroundVideo from "@/components/BackgroundVideo";
import Dashboard from "@/screens/Dashboard";
import Analyzer from "@/screens/Analyzer";
import YourHabits from "@/screens/YourHabits";
import Settings from "@/screens/Settings";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'analytics' | 'habits' | 'settings'>('dashboard');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-900">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analyzer />;
      case 'habits':
        return <YourHabits />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        <div className="min-h-screen bg-bg-900 text-text-primary">
          <BackgroundVideo />
          
          {/* Main Content */}
          <div className="relative z-10">
            {renderView()}
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation currentView={currentView} onNavigate={setCurrentView} />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
