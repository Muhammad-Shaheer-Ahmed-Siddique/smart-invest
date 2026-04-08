'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';

export function TopMoversWidget() {
  const { stockList } = useStocks();

  const { gainers, losers } = useMemo(() => {
    const sorted = [...stockList].sort((a, b) => {
      const aP = (a.currentPrice - a.previousClose) / a.previousClose;
      const bP = (b.currentPrice - b.previousClose) / b.previousClose;
      return bP - aP;
    });
    return { gainers: sorted.slice(0, 3), losers: sorted.slice(-3).reverse() };
  }, [stockList]);

  function StockItem({ stock, type }: { stock: (typeof stockList)[0]; type: 'gain' | 'loss' }) {
    const change = stock.currentPrice - stock.previousClose;
    const pct = stock.previousClose !== 0 ? change / stock.previousClose : 0;
    return (
      <Link
        href={`/market/${stock.ticker}`}
        className="flex items-center justify-between py-2 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[var(--bg-2)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">
            {stock.ticker.slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">{stock.ticker}</div>
            <div className="text-xs text-[var(--text-muted)]">{formatCurrency(stock.currentPrice)}</div>
          </div>
        </div>
        <span className={`text-sm font-medium ${type === 'gain' ? 'text-brand-500' : 'text-danger-500'}`}>
          {type === 'gain' ? '+' : ''}{formatPercent(pct)}
        </span>
      </Link>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-2 h-2 rounded-full bg-brand-500" />
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">Top Gainers</h4>
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {gainers.map((s) => <StockItem key={s.ticker} stock={s} type="gain" />)}
        </div>
      </div>
      <div className="bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-2 h-2 rounded-full bg-danger-500" />
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">Top Losers</h4>
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {losers.map((s) => <StockItem key={s.ticker} stock={s} type="loss" />)}
        </div>
      </div>
    </div>
  );
}
