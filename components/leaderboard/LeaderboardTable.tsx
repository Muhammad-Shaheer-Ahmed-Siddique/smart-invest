'use client';

import { useMemo } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useStocks } from '@/hooks/useStocks';
import { useAuth } from '@/hooks/useAuth';
import { generateLeaderboard } from '@/lib/leaderboard';
import { getPriceMap } from '@/lib/stockEngine';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { Avatar } from '@/components/ui';

export function LeaderboardTable() {
  const { user } = useAuth();
  const { portfolio } = usePortfolio();
  const { stocks } = useStocks();

  const entries = useMemo(() => {
    const prices = getPriceMap(stocks);
    return generateLeaderboard(user, portfolio, prices);
  }, [user, portfolio, stocks]);

  function RankDisplay({ rank }: { rank: number }) {
    if (rank === 1) return <span className="text-yellow-500 text-lg">🥇</span>;
    if (rank === 2) return <span className="text-gray-400 text-lg">🥈</span>;
    if (rank === 3) return <span className="text-amber-600 text-lg">🥉</span>;
    return <span className="text-sm font-semibold text-[var(--text-muted)] w-6 text-center">#{rank}</span>;
  }

  return (
    <div className="bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-5 py-3 bg-[var(--bg-1)] border-b border-[var(--border-color)] text-xs font-medium text-[var(--text-muted)]">
        <div className="w-10">Rank</div>
        <div className="flex-1">Trader</div>
        <div className="w-32 text-right">Net Worth</div>
        <div className="w-24 text-right hidden sm:block">24h Change</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[var(--border-color)]">
        {entries.map((entry) => (
          <div
            key={entry.userId}
            className={`flex items-center px-5 py-3.5 transition-colors ${
              entry.isCurrentUser
                ? 'bg-brand-500/5 border-l-2 border-brand-500'
                : 'hover:bg-[var(--bg-1)]'
            }`}
          >
            <div className="w-10 flex items-center">
              <RankDisplay rank={entry.rank} />
            </div>
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <Avatar initials={entry.avatarInitials} size="sm" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
                  {entry.username}
                  {entry.isCurrentUser && (
                    <span className="ml-2 text-xs text-brand-500 font-normal">(you)</span>
                  )}
                </div>
              </div>
            </div>
            <div className="w-32 text-right">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {formatCurrency(entry.netWorth)}
              </span>
            </div>
            <div className={`w-24 text-right hidden sm:block text-sm font-medium ${
              entry.change24h >= 0 ? 'text-brand-500' : 'text-danger-500'
            }`}>
              {entry.change24h >= 0 ? '+' : ''}{formatPercent(Math.abs(entry.change24h))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
