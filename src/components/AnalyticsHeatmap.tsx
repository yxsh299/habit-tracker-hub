import { cn } from '@/lib/utils';

interface HeatmapData {
  date: string;
  count: number;
}

interface AnalyticsHeatmapProps {
  data: HeatmapData[];
  maxCount?: number;
}

const AnalyticsHeatmap = ({ data, maxCount }: AnalyticsHeatmapProps) => {
  const getIntensityLevel = (count: number, max: number) => {
    if (count === 0) return 0;
    const percentage = (count / max) * 100;
    if (percentage <= 25) return 1;
    if (percentage <= 50) return 2;
    if (percentage <= 75) return 3;
    return 4;
  };

  const weeks = 12; // Show 12 weeks
  const daysPerWeek = 7;
  const today = new Date();
  
  // Generate dates for the last 12 weeks
  const dates: Date[] = [];
  for (let i = weeks * daysPerWeek - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  // Map data to dates
  const dataMap = new Map(
    data.map(d => [d.date, d.count])
  );

  const computedMaxCount = maxCount || Math.max(...data.map(d => d.count), 1);

  // Group dates by weeks
  const weekGroups: Date[][] = [];
  for (let i = 0; i < dates.length; i += daysPerWeek) {
    weekGroups.push(dates.slice(i, i + daysPerWeek));
  }

  const getIntensityColor = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-bg-700';
      case 1:
        return 'bg-accent/20';
      case 2:
        return 'bg-accent/40';
      case 3:
        return 'bg-accent/70';
      case 4:
        return 'bg-accent';
      default:
        return 'bg-bg-700';
    }
  };

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn(
                'w-3 h-3 rounded-sm',
                getIntensityColor(level)
              )}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pr-2 justify-around">
            {['Mon', 'Wed', 'Fri'].map((day, i) => (
              <div key={day} className="text-xs text-text-secondary h-3 flex items-center">
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {weekGroups.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((date, dayIndex) => {
                const dateStr = date.toISOString().split('T')[0];
                const count = dataMap.get(dateStr) || 0;
                const level = getIntensityLevel(count, computedMaxCount);
                
                return (
                  <div
                    key={dateStr}
                    className={cn(
                      'w-3 h-3 rounded-sm transition-all hover:ring-1 hover:ring-accent cursor-pointer',
                      getIntensityColor(level)
                    )}
                    title={`${dateStr}: ${count} completions`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeatmap;
export type { HeatmapData };
