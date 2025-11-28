import { TrendingUp, TrendingDown, Activity, Target, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: number;
  icon?: React.ReactNode;
  highlight?: boolean;
}

const SummaryCard = ({ label, value, unit, subtitle, trend, icon, highlight }: SummaryCardProps) => {
  return (
    <div className={cn(
      "ios-card p-6 space-y-3",
      highlight && "bg-accent/10 border border-accent/30"
    )}>
      <div className="flex items-start justify-between">
        <p className="text-text-secondary text-sm">{label}</p>
        {icon && <div className="text-accent">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-text-primary">{value}</span>
        {unit && <span className="text-xl font-semibold text-text-secondary">{unit}</span>}
      </div>

      {(subtitle || trend !== undefined) && (
        <div className="flex items-center gap-2">
          {trend !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend > 0 ? "text-success" : trend < 0 ? "text-danger" : "text-text-secondary"
            )}>
              {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
          {subtitle && (
            <span className="text-xs text-text-muted">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};

interface AnalyticsSummaryCardsProps {
  totalTime?: string;
  completions: number;
  currentStreak: number;
  successRate: number;
  avgPerDay?: number;
}

const AnalyticsSummaryCards = ({
  totalTime,
  completions,
  currentStreak,
  successRate,
  avgPerDay,
}: AnalyticsSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {totalTime && (
        <SummaryCard
          label="Duration"
          value={totalTime}
          subtitle="31h 7m"
          icon={<Clock className="w-5 h-5" />}
          highlight
        />
      )}
      
      <SummaryCard
        label="Total Habits"
        value={completions}
        subtitle={avgPerDay ? `${avgPerDay.toFixed(1)} per day` : undefined}
        icon={<Activity className="w-5 h-5" />}
      />

      <SummaryCard
        label="Current Streak"
        value={currentStreak}
        unit="days"
        icon={<Target className="w-5 h-5" />}
      />

      <SummaryCard
        label="Success Rate"
        value={successRate.toFixed(0)}
        unit="%"
        trend={successRate > 75 ? 5 : successRate < 50 ? -5 : 0}
        icon={<TrendingUp className="w-5 h-5" />}
      />
    </div>
  );
};

export default AnalyticsSummaryCards;
export { SummaryCard };
