import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BackgroundVideo from "@/components/BackgroundVideo";
import Dashboard from "@/screens/Dashboard";
import Analyzer from "@/screens/Analyzer";
import { Button } from "@/components/ui/button";
import { BarChart3, Home } from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'analyzer'>('dashboard');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        <div className="min-h-screen bg-bg-900 text-text-primary">
          <BackgroundVideo />
          
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-900/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <h1 className="text-xl font-bold text-accent">Habito</h1>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentView('dashboard')}
                  variant={currentView === 'dashboard' ? 'default' : 'outline'}
                  size="sm"
                  className={
                    currentView === 'dashboard'
                      ? 'bg-accent hover:bg-accent-hover text-accent-foreground'
                      : 'border-border text-text-secondary hover:bg-bg-700 hover:text-text-primary'
                  }
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                
                <Button
                  onClick={() => setCurrentView('analyzer')}
                  variant={currentView === 'analyzer' ? 'default' : 'outline'}
                  size="sm"
                  className={
                    currentView === 'analyzer'
                      ? 'bg-accent hover:bg-accent-hover text-accent-foreground'
                      : 'border-border text-text-secondary hover:bg-bg-700 hover:text-text-primary'
                  }
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="pt-16">
            {currentView === 'dashboard' ? <Dashboard /> : <Analyzer />}
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
