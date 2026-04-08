'use client';

import Link from 'next/link';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { calculateUnrealizedPnL } from '@/lib/portfolio';

export function HoldingsList() {
  const { portfolio, sellStock } = usePortfolio();
  const { stocks } = useStocks();

  if (!portfolio) return null;

  const holdings = Object.values(portfolio.holdings);

  if (holdings.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--text-muted)] text-sm">
        You don&apos;t own any stocks yet.{' '}
        <Link href="/market" className="text-brand-500 hover:underline">
          Browse the market
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-color)]">
            {['Stock', 'Shares', 'Avg Cost', 'Current Price', 'Market Value', 'P&L', ''].map((h) => (
              <th key={h} className="px-4 py-2 text-left text-xs font-medium text-[var(--text-muted)] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {holdings.map((h) => {
            const stock = stocks[h.ticker];
            if (!stock) return null;
            const { absolute, percent } = calculateUnrealizedPnL(h, stock.currentPrice);
            const isPositive = absolute >= 0;

            return (
              <tr key={h.ticker} className="hover:bg-[var(--bg-1)] transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/market/${h.ticker}`} className="flex items-center gap-2 group">
                    <div className="w-7 h-7 rounded-md bg-[var(--bg-2)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">
                      {h.ticker.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--text-primary)] group-hover:text-brand-500 transition-colors">
                        {h.ticker}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">{stock.name}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-[var(--text-primary)] tabular-nums">{h.shares}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)] tabular-nums">
                  {formatCurrency(h.avgCostBasis)}
                </td>
                <td className="px-4 py-3 text-[var(--text-primary)] tabular-nums">
                  {formatCurrency(stock.currentPrice)}
                </td>
                <td className="px-4 py-3 font-medium text-[var(--text-primary)] tabular-nums">
                  {formatCurrency(h.shares * stock.currentPrice)}
                </td>
                <td className="px-4 py-3">
                  <div className={`font-medium tabular-nums ${isPositive ? 'text-brand-500' : 'text-danger-500'}`}>
                    {isPositive ? '+' : ''}{formatCurrency(absolute)}
                  </div>
                  <div className={`text-xs ${isPositive ? 'text-brand-500' : 'text-danger-500'}`}>
                    {isPositive ? '+' : ''}{formatPercent(Math.abs(percent))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => sellStock(h.ticker, h.shares, stock.currentPrice)}
                    className="text-xs px-2 py-1 rounded-md border border-danger-500/40 text-danger-500 hover:bg-danger-500/10 transition-colors"
                  >
                    Sell All
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
