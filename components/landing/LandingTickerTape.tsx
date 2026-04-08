'use client';

import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';

export function LandingTickerTape() {
  const { stockList } = useStocks();

  const items = stockList.map((stock) => {
    const change = stock.currentPrice - stock.previousClose;
    const pct = stock.previousClose !== 0 ? change / stock.previousClose : 0;
    const isPositive = change >= 0;

    return (
      <div key={stock.ticker} className="inline-flex items-center gap-3 px-5 whitespace-nowrap">
        <span className="text-sm font-bold text-[var(--text-primary)]">{stock.ticker}</span>
        <span className="text-sm text-[var(--text-muted)]">{formatCurrency(stock.currentPrice)}</span>
        <span className={`text-xs font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
          {isPositive ? '\u2191' : '\u2193'} {isPositive ? '+' : ''}{formatPercent(pct)}
        </span>
      </div>
    );
  });

  return (
    <div className="w-full bg-[var(--bg-1)] border-b border-[var(--border-color)] overflow-hidden py-3">
      <div className="flex items-center">
        <div className="flex-shrink-0 px-5 flex items-center gap-2 border-r border-[var(--border-color)] mr-4">
          <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="ticker-tape inline-flex">
            {items}
            {items}
          </div>
        </div>
      </div>
    </div>
  );
}
