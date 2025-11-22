import { Trophy, Award, Star, Zap } from 'lucide-react';

interface MilestoneBadgesProps {
  longestStreak: number;
  totalCompletions: number;
}

const MilestoneBadges = ({ longestStreak, totalCompletions }: MilestoneBadgesProps) => {
  const badges = [];

  if (longestStreak >= 7) {
    badges.push({ icon: Trophy, label: '7-Day Warrior', color: 'text-accent' });
  }
  if (longestStreak >= 30) {
    badges.push({ icon: Award, label: '30-Day Champion', color: 'text-warning' });
  }
  if (totalCompletions >= 50) {
    badges.push({ icon: Star, label: '50 Completions', color: 'text-success' });
  }
  if (totalCompletions >= 100) {
    badges.push({ icon: Zap, label: 'Century Club', color: 'text-danger' });
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel p-4 mb-6">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
        Your Milestones
      </h3>
      <div className="flex flex-wrap gap-3">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-bg-800 border border-border rounded-lg"
            >
              <Icon className={`w-5 h-5 ${badge.color}`} />
              <span className="text-sm font-medium text-text-primary">{badge.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MilestoneBadges;
