'use client';

import { useMemo } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';

export default function PnLAnalyzerPage() {
  const { portfolio } = usePortfolio();
  const { stocks } = useStocks();

  const analysis = useMemo(() => {
    if (!portfolio) return null;
    const holdings = Object.values(portfolio.holdings);
    if (holdings.length === 0) return null;

    const items = holdings.map((h) => {
      const stock = stocks[h.ticker];
      const currentPrice = stock?.currentPrice ?? 0;
      const currentValue = h.shares * currentPrice;
      const pnl = currentValue - h.totalInvested;
      const pnlPercent = h.totalInvested > 0 ? pnl / h.totalInvested : 0;
      return { ticker: h.ticker, shares: h.shares, avgCost: h.avgCostBasis, currentPrice, invested: h.totalInvested, currentValue, pnl, pnlPercent };
    });

    const totalInvested = items.reduce((s, i) => s + i.invested, 0);
    const totalValue = items.reduce((s, i) => s + i.currentValue, 0);
    const totalPnl = totalValue - totalInvested;
    const totalPnlPercent = totalInvested > 0 ? totalPnl / totalInvested : 0;
    const best = items.reduce((a, b) => a.pnlPercent > b.pnlPercent ? a : b);
    const worst = items.reduce((a, b) => a.pnlPercent < b.pnlPercent ? a : b);

    return { items: items.sort((a, b) => b.pnl - a.pnl), totalInvested, totalValue, totalPnl, totalPnlPercent, best, worst };
  }, [portfolio, stocks]);

  return (
    <div className="neon-dashboard -m-4 md:-m-6 p-4 md:p-6 min-h-full bg-[var(--bg-1)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">P&L Analyzer</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Profit & loss breakdown across all holdings</p>
      </div>

      {!analysis ? (
        <div className="bg-[var(--bg-0)] rounded-2xl border border-[var(--border-color)] p-12 text-center text-[var(--text-muted)]">
          No holdings yet. Buy some stocks to see P&L analysis.
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Invested', value: formatCurrency(analysis.totalInvested), color: 'var(--text-primary)' },
              { label: 'Current Value', value: formatCurrency(analysis.totalValue), color: 'var(--text-primary)' },
              { label: 'Total P&L', value: `${analysis.totalPnl >= 0 ? '+' : ''}${formatCurrency(analysis.totalPnl)}`, color: analysis.totalPnl >= 0 ? '#00ff88' : '#ff4455' },
              { label: 'Return', value: `${analysis.totalPnlPercent >= 0 ? '+' : ''}${formatPercent(analysis.totalPnlPercent)}`, color: analysis.totalPnlPercent >= 0 ? '#00ff88' : '#ff4455' },
            ].map((c) => (
              <div key={c.label} className="bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] p-5">
                <div className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">{c.label}</div>
                <div className="text-xl font-bold" style={{ color: c.color }}>{c.value}</div>
              </div>
            ))}
          </div>

          {/* Best / Worst */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] p-5">
              <div className="text-xs font-semibold text-[#00ff88] uppercase mb-2">Best Performer</div>
              <div className="text-lg font-bold text-[var(--text-primary)]">{analysis.best.ticker}</div>
              <div className="text-sm text-[#00ff88]">+{formatPercent(analysis.best.pnlPercent)}</div>
            </div>
            <div className="bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] p-5">
              <div className="text-xs font-semibold text-[#ff4455] uppercase mb-2">Worst Performer</div>
              <div className="text-lg font-bold text-[var(--text-primary)]">{analysis.worst.ticker}</div>
              <div className="text-sm text-[#ff4455]">{formatPercent(analysis.worst.pnlPercent)}</div>
            </div>
          </div>

          {/* Holdings table */}
          <div className="bg-[var(--bg-0)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
            <div className="flex items-center px-5 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)]">
              <div className="w-28">Ticker</div>
              <div className="w-20 text-right">Shares</div>
              <div className="w-28 text-right">Avg Cost</div>
              <div className="w-28 text-right">Current</div>
              <div className="w-28 text-right">Invested</div>
              <div className="w-28 text-right">Value</div>
              <div className="flex-1 text-right">P&L</div>
            </div>
            {analysis.items.map((item) => {
              const color = item.pnl >= 0 ? '#00ff88' : '#ff4455';
              return (
                <div key={item.ticker} className="flex items-center px-5 py-3.5 border-b border-[var(--border-color)] last:border-0">
                  <div className="w-28 font-bold text-[var(--text-primary)]">{item.ticker}</div>
                  <div className="w-20 text-right text-[var(--text-secondary)]">{item.shares}</div>
                  <div className="w-28 text-right text-[var(--text-secondary)]">{formatCurrency(item.avgCost)}</div>
                  <div className="w-28 text-right text-[var(--text-primary)]">{formatCurrency(item.currentPrice)}</div>
                  <div className="w-28 text-right text-[var(--text-secondary)]">{formatCurrency(item.invested)}</div>
                  <div className="w-28 text-right text-[var(--text-primary)]">{formatCurrency(item.currentValue)}</div>
                  <div className="flex-1 text-right">
                    <span className="font-bold" style={{ color }}>{item.pnl >= 0 ? '+' : ''}{formatCurrency(item.pnl)}</span>
                    <span className="text-xs ml-2" style={{ color }}>({item.pnlPercent >= 0 ? '+' : ''}{formatPercent(item.pnlPercent)})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
