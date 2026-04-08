'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStocks } from '@/hooks/useStocks';
import { usePortfolio } from '@/hooks/usePortfolio';
import { formatCurrency } from '@/lib/formatters';
import { PriceTickerBadge } from './PriceTickerBadge';
import { PriceChart } from './PriceChart';
import { BuySellPanel } from './BuySellPanel';
import { Badge, Card } from '@/components/ui';

interface StockDetailClientProps {
  ticker: string;
}

export function StockDetailClient({ ticker }: StockDetailClientProps) {
  const { getStock } = useStocks();
  const { getHolding, addToWatchlist, removeFromWatchlist, portfolio } = usePortfolio();
  const router = useRouter();
  const stock = getStock(ticker);

  useEffect(() => {
    if (!stock) router.replace('/market');
  }, [stock, router]);

  if (!stock) return null;

  const holding = getHolding(ticker);
  const change = stock.currentPrice - stock.previousClose;
  const changePercent = stock.previousClose !== 0 ? change / stock.previousClose : 0;
  const isInWatchlist = portfolio?.watchlist.includes(ticker);

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Market
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">{stock.ticker}</h1>
            <Badge variant="default">{stock.sector}</Badge>
          </div>
          <p className="text-[var(--text-muted)]">{stock.name}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {formatCurrency(stock.currentPrice)}
            </span>
            <PriceTickerBadge change={change} changePercent={changePercent} showAbsolute />
          </div>
        </div>
        <button
          onClick={() =>
            isInWatchlist ? removeFromWatchlist(ticker) : addToWatchlist(ticker)
          }
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            isInWatchlist
              ? 'border-warning-500 text-warning-500 bg-warning-500/10'
              : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-2)]'
          }`}
        >
          <svg className="w-4 h-4" fill={isInWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          {isInWatchlist ? 'Watching' : 'Watchlist'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Chart + Info */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <PriceChart priceHistory={stock.priceHistory} />
          </Card>

          {/* Stock Info */}
          <Card>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">About {stock.name}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              {stock.description}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Open', value: formatCurrency(stock.openPrice) },
                { label: 'Prev Close', value: formatCurrency(stock.previousClose) },
                { label: 'Market Cap', value: stock.marketCap },
                { label: 'Sector', value: stock.sector },
                { label: 'Change', value: formatCurrency(Math.abs(change)) },
                { label: 'Change %', value: `${changePercent >= 0 ? '+' : ''}${(changePercent * 100).toFixed(2)}%` },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg bg-[var(--bg-1)]">
                  <div className="text-xs text-[var(--text-muted)] mb-1">{item.label}</div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">{item.value}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Your position */}
          {holding && (
            <Card>
              <h3 className="font-semibold text-[var(--text-primary)] mb-3">Your Position</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Shares', value: holding.shares },
                  { label: 'Avg Cost', value: formatCurrency(holding.avgCostBasis) },
                  { label: 'Market Value', value: formatCurrency(holding.shares * stock.currentPrice) },
                  {
                    label: 'P&L',
                    value: formatCurrency(holding.shares * stock.currentPrice - holding.totalInvested),
                    positive: holding.shares * stock.currentPrice >= holding.totalInvested,
                  },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg bg-[var(--bg-1)]">
                    <div className="text-xs text-[var(--text-muted)] mb-1">{item.label}</div>
                    <div
                      className={`text-sm font-semibold ${
                        item.positive === undefined
                          ? 'text-[var(--text-primary)]'
                          : item.positive
                          ? 'text-brand-500'
                          : 'text-danger-500'
                      }`}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right: Buy/Sell */}
        <div>
          <BuySellPanel stock={stock} />
        </div>
      </div>
    </div>
  );
}
