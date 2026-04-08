'use client';

import Link from 'next/link';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';

export function WatchlistWidget() {
  const { portfolio, removeFromWatchlist } = usePortfolio();
  const { getStock } = useStocks();

  const watchlist = portfolio?.watchlist ?? [];

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-[var(--text-muted)]">
        No stocks in watchlist.{' '}
        <Link href="/market" className="text-brand-500 hover:underline">
          Browse market
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--border-color)]">
      {watchlist.map((ticker) => {
        const stock = getStock(ticker);
        if (!stock) return null;
        const change = stock.currentPrice - stock.previousClose;
        const pct = stock.previousClose !== 0 ? change / stock.previousClose : 0;
        const isPositive = change >= 0;

        return (
          <div key={ticker} className="flex items-center justify-between py-2.5">
            <Link href={`/market/${ticker}`} className="flex items-center gap-2 hover:opacity-80">
              <div className="w-7 h-7 rounded-md bg-[var(--bg-2)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">
                {ticker.slice(0, 2)}
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">{ticker}</div>
                <div className="text-xs text-[var(--text-muted)]">{stock.name}</div>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-[var(--text-primary)]">
                  {formatCurrency(stock.currentPrice)}
                </div>
                <div className={`text-xs ${isPositive ? 'text-brand-500' : 'text-danger-500'}`}>
                  {isPositive ? '+' : ''}{formatPercent(pct)}
                </div>
              </div>
              <button
                onClick={() => removeFromWatchlist(ticker)}
                className="text-[var(--text-muted)] hover:text-danger-500 transition-colors"
                aria-label={`Remove ${ticker} from watchlist`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
