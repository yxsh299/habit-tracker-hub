import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActiveTaskHeroProps {
  taskName: string;
  startTime: Date;
  estimatedDuration: number; // in minutes
  backgroundImage?: string;
  onComplete: () => void;
  onCancel: () => void;
  onBackgroundChange: (file: File) => void;
}

const ActiveTaskHero = ({
  taskName,
  startTime,
  estimatedDuration,
  backgroundImage,
  onComplete,
  onCancel,
  onBackgroundChange,
}: ActiveTaskHeroProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const estimatedEndTime = new Date(startTime.getTime() + estimatedDuration * 60000);
  const formatTimeOnly = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onBackgroundChange(file);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-3xl overflow-hidden ios-card p-6",
        "min-h-[280px] flex flex-col justify-between"
      )}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-900/70 via-bg-900/50 to-bg-900/80 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-text-secondary text-sm mb-1">Active Task</p>
            <h2 className="text-2xl font-bold text-text-primary">{taskName}</h2>
          </div>
          <Button
            onClick={onCancel}
            variant="ghost"
            size="icon"
            className="text-text-secondary hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Timer Display */}
        <div className="text-center space-y-2">
          <p className="text-text-secondary text-sm">Time elapsed</p>
          <div className="text-5xl font-bold text-accent tracking-wider">
            {formatTime(elapsedTime)}
          </div>
        </div>

        {/* Time Info */}
        <div className="flex items-center justify-around py-4 bg-bg-800/50 rounded-2xl backdrop-blur-sm">
          <div className="text-center">
            <p className="text-text-secondary text-xs mb-1">Started</p>
            <p className="text-text-primary font-semibold">{formatTimeOnly(startTime)}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-text-secondary text-xs mb-1">Estimated End</p>
            <p className="text-text-primary font-semibold">{formatTimeOnly(estimatedEndTime)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <label className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="btn-secondary flex items-center justify-center gap-2 cursor-pointer py-3 rounded-xl border border-border bg-bg-700 hover:bg-bg-600 transition-all">
              <Upload className="w-4 h-4" />
              <span className="text-sm">Change BG</span>
            </div>
          </label>
          <Button
            onClick={onComplete}
            className="flex-1 bg-success hover:bg-success/90 text-success-foreground py-3 rounded-xl"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Complete Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActiveTaskHero;
