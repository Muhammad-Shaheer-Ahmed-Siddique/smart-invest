'use client';

import { usePortfolio } from '@/hooks/usePortfolio';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { calculatePortfolioValue, calculateNetWorth } from '@/lib/portfolio';
import { StatCard } from './StatCard';

export function DashboardStats() {
  const { portfolio, currentNetWorth } = usePortfolio();
  const { stocks } = useStocks();

  if (!portfolio) return null;

  const prices: Record<string, number> = {};
  for (const t in stocks) prices[t] = stocks[t].currentPrice;

  const portfolioValue = calculatePortfolioValue(portfolio.holdings, prices);
  const totalInvested = Object.values(portfolio.holdings).reduce((s, h) => s + h.totalInvested, 0);
  const pnl = portfolioValue - totalInvested;
  const pnlPercent = totalInvested !== 0 ? pnl / totalInvested : 0;

  // Day P&L: compare current to latest snapshot from > 1 min ago
  const history = portfolio.netWorthHistory;
  const recent = history.length >= 2 ? history[history.length - 2] : null;
  const dayChange = recent ? currentNetWorth - recent.netWorth : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Net Worth"
        value={formatCurrency(currentNetWorth)}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        label="Cash Balance"
        value={formatCurrency(portfolio.cashBalance)}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />
      <StatCard
        label="Invested Value"
        value={formatCurrency(portfolioValue)}
        sub={`${Object.keys(portfolio.holdings).length} positions`}
      />
      <StatCard
        label="Unrealized P&L"
        value={formatCurrency(pnl)}
        sub={`${pnlPercent >= 0 ? '+' : ''}${formatPercent(pnlPercent)}`}
        positive={pnl >= 0}
      />
    </div>
  );
}
