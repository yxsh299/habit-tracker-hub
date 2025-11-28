import { useState, useEffect } from 'react';
import { TimeRange, AnalyticsData } from '@/types';
import { getCompletionLog } from '@/services/completionLog';
import AnalyticsHeatmap, { HeatmapData } from '@/components/AnalyticsHeatmap';
import AnalyticsSummaryCards from '@/components/AnalyticsSummaryCards';
import YearHeatmap from '@/components/YearHeatmap';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import '@/theme/analyzer.css';

const Analyzer = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCompletions: 0,
    currentStreak: 0,
    successRate: 0,
    timeOfDayBreakdown: { morning: 0, afternoon: 0, evening: 0, anytime: 0 },
    obstacleBreakdown: {},
    dailySuccessRate: [],
  });
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [yearData, setYearData] = useState<{ date: string; completed: boolean }[]>([]);
  const [showYearView, setShowYearView] = useState(false);
  const [animateGraph, setAnimateGraph] = useState(false);

  useEffect(() => {
    calculateAnalytics();
    fetchHeatmapData();
    fetchYearData();
  }, [timeRange, user]);

  const fetchHeatmapData = async () => {
    if (!user) return;

    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('habit_completions')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .gte('completed_at', startDate.toISOString());

    if (!error && data) {
      const countByDate = new Map<string, number>();
      data.forEach(completion => {
        const date = new Date(completion.completed_at).toISOString().split('T')[0];
        countByDate.set(date, (countByDate.get(date) || 0) + 1);
      });

      const heatmap: HeatmapData[] = Array.from(countByDate.entries()).map(([date, count]) => ({
        date,
        count,
      }));
      
      setHeatmapData(heatmap);
    }
  };

  const fetchYearData = async () => {
    if (!user) return;

    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const { data, error } = await supabase
      .from('habit_completions')
      .select('completed_at, status')
      .eq('user_id', user.id)
      .gte('completed_at', startDate.toISOString())
      .lte('completed_at', endDate.toISOString());

    if (!error && data) {
      const yearCompletions = data.map(completion => ({
        date: new Date(completion.completed_at).toISOString().split('T')[0],
        completed: completion.status === 'completed',
      }));
      
      setYearData(yearCompletions);
    }
  };

  const calculateAnalytics = () => {
    const log = getCompletionLog();
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        startDate = new Date(0);
    }

    const filteredLog = log.filter(entry => new Date(entry.timestamp) >= startDate);

    // Calculate metrics
    const completedEntries = filteredLog.filter(e => e.status === 'completed');
    const missedEntries = filteredLog.filter(e => e.status === 'missed');
    const totalCompletions = completedEntries.length;
    const totalAttempts = completedEntries.length + missedEntries.length;
    const successRate = totalAttempts > 0 ? (totalCompletions / totalAttempts) * 100 : 0;

    // Time of day breakdown
    const timeOfDayBreakdown = {
      morning: completedEntries.filter(e => e.metadata?.timeOfDay === 'morning').length,
      afternoon: completedEntries.filter(e => e.metadata?.timeOfDay === 'afternoon').length,
      evening: completedEntries.filter(e => e.metadata?.timeOfDay === 'evening').length,
      anytime: completedEntries.filter(e => e.metadata?.timeOfDay === 'anytime').length,
    };

    // Obstacle breakdown
    const obstacleBreakdown: Record<string, number> = {};
    missedEntries.forEach(entry => {
      const reason = entry.metadata?.reason || 'No reason provided';
      obstacleBreakdown[reason] = (obstacleBreakdown[reason] || 0) + 1;
    });

    // Daily success rate (for graph)
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const dailySuccessRate = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayCompleted = filteredLog.filter(
        e => e.status === 'completed' && e.timestamp.startsWith(dateStr)
      ).length;
      
      const dayMissed = filteredLog.filter(
        e => e.status === 'missed' && e.timestamp.startsWith(dateStr)
      ).length;
      
      const dayTotal = dayCompleted + dayMissed;
      const rate = dayTotal > 0 ? (dayCompleted / dayTotal) * 100 : 0;
      
      dailySuccessRate.push({ date: dateStr, rate });
    }

    // Calculate current streak
    const sortedCompletions = completedEntries
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    let currentStreak = 0;
    let lastDate: Date | null = null;
    
    for (const entry of sortedCompletions) {
      const entryDate = new Date(entry.timestamp);
      entryDate.setHours(0, 0, 0, 0);
      
      if (!lastDate) {
        lastDate = entryDate;
        currentStreak = 1;
      } else {
        const dayDiff = Math.floor((lastDate.getTime() - entryDate.getTime()) / (24 * 60 * 60 * 1000));
        if (dayDiff === 1) {
          currentStreak++;
          lastDate = entryDate;
        } else if (dayDiff > 1) {
          break;
        }
      }
    }

    setAnalytics({
      totalCompletions,
      currentStreak,
      successRate,
      timeOfDayBreakdown,
      obstacleBreakdown,
      dailySuccessRate,
    });

    // Trigger graph animation
    setAnimateGraph(false);
    setTimeout(() => setAnimateGraph(true), 50);
  };

  const timeRangePills: { value: TimeRange; label: string }[] = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: 'all', label: 'All Time' },
  ];

  const sortedObstacles = Object.entries(analytics.obstacleBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxObstacleCount = Math.max(...Object.values(analytics.obstacleBreakdown), 1);

  return (
    <div className="analyzer-container relative z-10 pb-24">
      <div className="analyzer-header">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-1">Analytics</h1>
          <p className="text-text-secondary">Your habit insights and patterns</p>
        </div>

        <div className="time-range-pills">
          {timeRangePills.map(pill => (
            <button
              key={pill.value}
              onClick={() => setTimeRange(pill.value)}
              className={`time-pill ${timeRange === pill.value ? 'active' : ''}`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <AnalyticsSummaryCards
        completions={analytics.totalCompletions}
        currentStreak={analytics.currentStreak}
        successRate={analytics.successRate}
      />

      {/* GitHub-style Heatmap */}
      <div className="chart-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="chart-title">Activity Heatmap</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowYearView(!showYearView)}
            className="text-accent hover:text-accent-hover"
          >
            {showYearView ? 'Show Month' : 'Show Year'}
          </Button>
        </div>
        {showYearView ? (
          <YearHeatmap year={new Date().getFullYear()} completionData={yearData} />
        ) : (
          <AnalyticsHeatmap data={heatmapData} />
        )}
      </div>

      {/* Progress Bars for Categories */}
      <div className="chart-section">
        <h2 className="chart-title mb-4">Completion Rate by Time of Day</h2>
        <div className="space-y-4">
          {Object.entries(analytics.timeOfDayBreakdown).map(([time, count]) => {
            const total = Object.values(analytics.timeOfDayBreakdown).reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={time} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary capitalize">{time}</span>
                  <span className="text-text-primary font-semibold">{count} ({percentage.toFixed(0)}%)</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="chart-section">
        <h2 className="chart-title">Success Rate Over Time</h2>
        <div className="relative h-64">
          <svg viewBox="0 0 800 200" className="w-full h-full">
            <defs>
              <linearGradient id="successGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line
                key={y}
                x1="0"
                y1={200 - (y * 2)}
                x2="800"
                y2={200 - (y * 2)}
                stroke="hsl(var(--border-subtle))"
                strokeWidth="1"
                opacity="0.3"
              />
            ))}

            {/* Success rate line */}
            {analytics.dailySuccessRate.length > 1 && (
              <>
                <path
                  d={`M ${analytics.dailySuccessRate
                    .map((point, i) => {
                      const x = (i / (analytics.dailySuccessRate.length - 1)) * 800;
                      const y = 200 - (point.rate * 2);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}`}
                  fill="none"
                  stroke="hsl(var(--accent))"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className={animateGraph ? 'sweep-animation' : ''}
                  style={{
                    strokeDasharray: animateGraph ? undefined : 1000,
                    strokeDashoffset: animateGraph ? undefined : 1000,
                  }}
                />
                <path
                  d={`M ${analytics.dailySuccessRate
                    .map((point, i) => {
                      const x = (i / (analytics.dailySuccessRate.length - 1)) * 800;
                      const y = 200 - (point.rate * 2);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')} L 800 200 L 0 200 Z`}
                  fill="url(#successGradient)"
                  opacity="0.5"
                />
              </>
            )}
          </svg>
        </div>
      </div>

      <div className="analysis-grid">
        <div className="chart-section">
          <h2 className="chart-title">Time of Day Analysis</h2>
          <div className="time-of-day-grid">
            {Object.entries(analytics.timeOfDayBreakdown).map(([time, count]) => (
              <div key={time} className="time-slot-card">
                <div className="time-slot-label">{time}</div>
                <div className="time-slot-value">{count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-section">
          <h2 className="chart-title">Top Obstacles</h2>
          {sortedObstacles.length > 0 ? (
            <div className="obstacle-list">
              {sortedObstacles.map(([reason, count]) => (
                <div key={reason} className="obstacle-item">
                  <div className="obstacle-label">{reason}</div>
                  <div className="obstacle-bar-container">
                    <div
                      className="obstacle-bar"
                      style={{ width: `${(count / maxObstacleCount) * 100}%` }}
                    />
                  </div>
                  <div className="obstacle-count">{count}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-sm">No obstacles recorded yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
