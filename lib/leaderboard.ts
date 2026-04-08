import type { User, Portfolio, LeaderboardEntry } from '@/types';
import { MOCK_LEADERBOARD_USERS } from '@/data/leaderboard-seed';
import { calculateNetWorth } from '@/lib/portfolio';

export function generateLeaderboard(
  user: User | null,
  portfolio: Portfolio | null,
  prices: Record<string, number>
): LeaderboardEntry[] {
  const entries: Omit<LeaderboardEntry, 'rank'>[] = MOCK_LEADERBOARD_USERS.map((u) => ({
    userId: u.userId,
    username: u.username,
    avatarInitials: u.avatarInitials,
    netWorth: u.netWorth,
    change24h: u.change24h,
    isCurrentUser: false,
  }));

  if (user && portfolio) {
    const netWorth = calculateNetWorth(portfolio, prices);
    const existing = entries.findIndex((e) => e.userId === user.id);
    const userEntry = {
      userId: user.id,
      username: user.username,
      avatarInitials: user.avatarInitials,
      netWorth,
      change24h: (() => {
        const hist = portfolio.netWorthHistory;
        if (hist.length < 2) return 0;
        const prev = hist[0].netWorth;
        return prev !== 0 ? (netWorth - prev) / prev : 0;
      })(),
      isCurrentUser: true,
    };

    if (existing >= 0) {
      entries[existing] = userEntry;
    } else {
      entries.push(userEntry);
    }
  }

  return entries
    .sort((a, b) => b.netWorth - a.netWorth)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}
