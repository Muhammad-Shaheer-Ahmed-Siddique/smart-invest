'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';

function MiniChart({ prices, isPositive }: { prices: number[]; isPositive: boolean }) {
  const color = isPositive ? '#00ff88' : '#ff4455';
  const data = prices.map((v, i) => ({ v, i }));
  const gradId = `wl-${isPositive ? 'g' : 'r'}`;
  return (
    <div className="w-14 h-7">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 1, right: 0, bottom: 1, left: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#${gradId})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function NeonWatchlist() {
  const { portfolio, removeFromWatchlist } = usePortfolio();
  const { getStock } = useStocks();

  const watchlist = portfolio?.watchlist ?? [];

  if (watchlist.length === 0) {
    return (
      <div className="neon-card p-5 h-full">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-[var(--neon-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--neon-text)]">Watchlist</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[var(--neon-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-sm text-[var(--neon-muted)] mb-2">No stocks in watchlist</p>
          <Link href="/market" className="text-xs font-medium text-[var(--neon-cyan)] hover:underline">
            Browse market
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="neon-card p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-[var(--neon-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--neon-text)]">Watchlist</h3>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-md bg-white/[0.05] text-[var(--neon-muted)]">
          {watchlist.length}
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        <div className="space-y-1">
          {watchlist.map((ticker) => {
            const stock = getStock(ticker);
            if (!stock) return null;
            const change = stock.currentPrice - stock.previousClose;
            const pct = stock.previousClose !== 0 ? change / stock.previousClose : 0;
            const isPositive = change >= 0;
            const prices = stock.priceHistory.slice(-15).map((p) => p.price);

            return (
              <motion.div
                key={ticker}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-all group"
              >
                <Link href={`/market/${ticker}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: 'rgba(0, 212, 255, 0.08)',
                      border: '1px solid rgba(0, 212, 255, 0.15)',
                      color: '#00d4ff',
                    }}
                  >
                    {ticker.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[var(--neon-text)] group-hover:text-[var(--neon-cyan)] transition-colors">
                      {ticker}
                    </div>
                    <div className="text-xs text-[var(--neon-muted)] truncate">{stock.name}</div>
                  </div>
                </Link>

                <MiniChart prices={prices} isPositive={isPositive} />

                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-semibold text-[var(--neon-text)]">
                    {formatCurrency(stock.currentPrice)}
                  </div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: isPositive ? '#00ff88' : '#ff4455' }}
                  >
                    {isPositive ? '+' : ''}{formatPercent(pct)}
                  </div>
                </div>

                <button
                  onClick={() => removeFromWatchlist(ticker)}
                  className="opacity-0 group-hover:opacity-100 text-[var(--neon-muted)] hover:text-[#ff4455] transition-all flex-shrink-0"
                  aria-label={`Remove ${ticker}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}
