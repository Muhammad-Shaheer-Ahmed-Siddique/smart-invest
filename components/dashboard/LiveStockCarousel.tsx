'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';

const FEATURED_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'TSLA', 'AMZN', 'META', 'JPM'];
const ROTATE_INTERVAL = 5000;

const SECTOR_ICONS: Record<string, string> = {
  Technology: '01',
  Finance: '02',
  Consumer: '03',
};

export function LiveStockCarousel() {
  const { getStock } = useStocks();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % FEATURED_TICKERS.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(nextSlide, ROTATE_INTERVAL);
    return () => clearInterval(id);
  }, [isPaused, nextSlide]);

  const ticker = FEATURED_TICKERS[activeIndex];
  const stock = getStock(ticker);

  const chartData = useMemo(() => {
    if (!stock) return [];
    const history = stock.priceHistory.slice(-60);
    return history.map((p) => ({
      time: new Date(p.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      price: p.price,
    }));
  }, [stock]);

  if (!stock) return null;

  const change = stock.currentPrice - stock.previousClose;
  const changePct = stock.previousClose !== 0 ? change / stock.previousClose : 0;
  const isPositive = change >= 0;
  const accentColor = isPositive ? '#00ff88' : '#ff4455';
  const gradientId = `carousel-grad-${ticker}`;

  const minPrice = chartData.length > 0 ? Math.min(...chartData.map((d) => d.price)) * 0.999 : 0;
  const maxPrice = chartData.length > 0 ? Math.max(...chartData.map((d) => d.price)) * 1.001 : 100;

  return (
    <div
      className="neon-card-glow neon-pulse-border p-6 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background glow effect */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${accentColor} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff88] live-dot" />
            <span className="text-xs font-medium text-[var(--neon-subtext)]">LIVE MARKET DATA</span>
          </div>
          <div className="flex items-center gap-1.5">
            {FEATURED_TICKERS.map((t, i) => (
              <button
                key={t}
                onClick={() => setActiveIndex(i)}
                className={`carousel-dot ${i === activeIndex ? 'active' : ''}`}
                aria-label={`Go to ${t}`}
              />
            ))}
          </div>
        </div>

        {/* Stock Info + Chart */}
        <AnimatePresence mode="wait">
          <motion.div
            key={ticker}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Left: stock info */}
              <div className="flex-shrink-0 lg:w-[260px]">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}05)`,
                      border: `1px solid ${accentColor}30`,
                      color: accentColor,
                    }}
                  >
                    {ticker.slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--neon-text)]">{ticker}</h2>
                    <p className="text-sm text-[var(--neon-muted)]">{stock.name}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-bold text-[var(--neon-text)] mb-1">
                    {formatCurrency(stock.currentPrice)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-semibold px-2 py-0.5 rounded-md"
                      style={{
                        color: accentColor,
                        background: `${accentColor}15`,
                      }}
                    >
                      {isPositive ? '+' : ''}{formatCurrency(change)}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: accentColor }}
                    >
                      ({isPositive ? '+' : ''}{formatPercent(changePct)})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-[var(--neon-muted)] mb-0.5">Open</div>
                    <div className="text-sm font-medium text-[var(--neon-text)]">{formatCurrency(stock.openPrice)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--neon-muted)] mb-0.5">Prev Close</div>
                    <div className="text-sm font-medium text-[var(--neon-text)]">{formatCurrency(stock.previousClose)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--neon-muted)] mb-0.5">Market Cap</div>
                    <div className="text-sm font-medium text-[var(--neon-text)]">{stock.marketCap}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--neon-muted)] mb-0.5">Sector</div>
                    <div className="text-sm font-medium text-[var(--neon-text)]">{stock.sector}</div>
                  </div>
                </div>
              </div>

              {/* Right: chart */}
              <div className="flex-1 min-w-0">
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={accentColor} stopOpacity={0.3} />
                        <stop offset="50%" stopColor={accentColor} stopOpacity={0.1} />
                        <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fill: '#5a6a8a' }}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      domain={[minPrice, maxPrice]}
                      tick={{ fontSize: 10, fill: '#5a6a8a' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${v.toFixed(0)}`}
                      width={55}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#0f1629',
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#f0f4ff',
                        boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)',
                      }}
                      formatter={(v) => [formatCurrency(Number(v)), 'Price']}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={accentColor}
                      strokeWidth={2.5}
                      fill={`url(#${gradientId})`}
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: accentColor,
                        stroke: '#0a0e1a',
                        strokeWidth: 2,
                        style: { filter: `drop-shadow(0 0 6px ${accentColor})` },
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
