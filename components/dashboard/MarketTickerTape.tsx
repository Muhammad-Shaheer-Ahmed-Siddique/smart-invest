'use client';

import Link from 'next/link';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';

export function MarketTickerTape() {
  const { stockList } = useStocks();

  const items = stockList.map((stock) => {
    const change = stock.currentPrice - stock.previousClose;
    const pct = stock.previousClose !== 0 ? change / stock.previousClose : 0;
    const isPositive = change >= 0;

    return (
      <Link
        key={stock.ticker}
        href={`/market/${stock.ticker}`}
        className="inline-flex items-center gap-2.5 px-4 py-2 whitespace-nowrap hover:bg-white/[0.03] transition-colors rounded-lg group"
      >
        <span className="text-sm font-bold text-[var(--neon-text)] group-hover:text-[var(--neon-cyan)] transition-colors">
          {stock.ticker}
        </span>
        <span className="text-sm text-[var(--neon-subtext)]">
          {formatCurrency(stock.currentPrice)}
        </span>
        <span
          className="text-xs font-semibold px-1.5 py-0.5 rounded"
          style={{
            color: isPositive ? '#00ff88' : '#ff4455',
            background: isPositive ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,85,0.1)',
          }}
        >
          {isPositive ? '+' : ''}{formatPercent(pct)}
        </span>
      </Link>
    );
  });

  return (
    <div className="neon-card overflow-hidden mb-6">
      <div className="flex items-center">
        {/* Live badge */}
        <div className="flex-shrink-0 px-4 py-3 border-r border-white/[0.06] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff88] live-dot" />
          <span className="text-xs font-bold tracking-wider text-[var(--neon-cyan)]">LIVE</span>
        </div>

        {/* Scrolling tape */}
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
