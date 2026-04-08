'use client';

import { usePortfolio } from '@/hooks/usePortfolio';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { calculatePortfolioValue } from '@/lib/portfolio';

export function PortfolioSummaryCard() {
  const { portfolio, currentNetWorth } = usePortfolio();
  const { stocks } = useStocks();

  if (!portfolio) return null;

  const prices: Record<string, number> = {};
  for (const t in stocks) prices[t] = stocks[t].currentPrice;

  const portfolioValue = calculatePortfolioValue(portfolio.holdings, prices);
  const totalInvested = Object.values(portfolio.holdings).reduce((s, h) => s + h.totalInvested, 0);
  const totalPnL = portfolioValue - totalInvested;
  const totalPnLPercent = totalInvested !== 0 ? totalPnL / totalInvested : 0;

  const stats = [
    { label: 'Net Worth', value: formatCurrency(currentNetWorth), sub: null, accent: false },
    { label: 'Cash Balance', value: formatCurrency(portfolio.cashBalance), sub: null, accent: false },
    { label: 'Portfolio Value', value: formatCurrency(portfolioValue), sub: null, accent: false },
    {
      label: 'Unrealized P&L',
      value: formatCurrency(totalPnL),
      sub: formatPercent(Math.abs(totalPnLPercent)),
      accent: true,
      positive: totalPnL >= 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] p-4">
          <div className="text-xs text-[var(--text-muted)] mb-1">{s.label}</div>
          <div
            className={`text-xl font-bold ${
              s.accent
                ? s.positive
                  ? 'text-brand-500'
                  : 'text-danger-500'
                : 'text-[var(--text-primary)]'
            }`}
          >
            {s.value}
          </div>
          {s.sub && (
            <div className={`text-xs mt-0.5 ${s.positive ? 'text-brand-500' : 'text-danger-500'}`}>
              {s.positive ? '+' : '-'}{s.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
