import { cn } from '@/lib/utils';

interface YearHeatmapProps {
  year: number;
  completionData: { date: string; completed: boolean }[];
}

const YearHeatmap = ({ year, completionData }: YearHeatmapProps) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const completionMap = new Map(
    completionData.map(d => [d.date, d.completed])
  );

  const renderMonth = (monthIndex: number) => {
    const daysInMonth = getDaysInMonth(monthIndex, year);
    const firstDay = getFirstDayOfMonth(monthIndex, year);
    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = new Array(7).fill(null);
    
    // Fill initial empty days
    for (let i = 0; i < firstDay; i++) {
      currentWeek[i] = null;
    }

    // Fill days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = (firstDay + day - 1) % 7;
      currentWeek[dayOfWeek] = day;
      
      if (dayOfWeek === 6 || day === daysInMonth) {
        weeks.push([...currentWeek]);
        currentWeek = new Array(7).fill(null);
      }
    }

    const dateStr = (day: number) => {
      return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    return (
      <div key={monthIndex} className="space-y-2">
        <h3 className="text-sm font-medium text-text-secondary">{months[monthIndex]}</h3>
        <div className="space-y-1">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex gap-1">
              {week.map((day, dayIdx) => {
                if (day === null) {
                  return <div key={dayIdx} className="w-3 h-3" />;
                }
                const completed = completionMap.get(dateStr(day));
                return (
                  <div
                    key={dayIdx}
                    className={cn(
                      'w-3 h-3 rounded-sm transition-all',
                      completed === true && 'bg-accent',
                      completed === false && 'bg-bg-700',
                      completed === undefined && 'bg-bg-700 opacity-50'
                    )}
                    title={`${dateStr(day)}: ${completed ? 'Completed' : 'Missed'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="ios-card overflow-auto">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-6 p-2">
        {months.map((_, idx) => renderMonth(idx))}
      </div>
    </div>
  );
};

export default YearHeatmap;
