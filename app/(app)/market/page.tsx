'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import type { StockSector } from '@/types';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const SECTOR_TABS: (StockSector | 'All')[] = ['All', 'Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial', 'Utilities', 'Materials'];
const VIEW_TABS = ['All Stocks', 'Gainers', 'Losers'] as const;

function StockChart({ prices, isPositive, ticker }: { prices: number[]; isPositive: boolean; ticker: string }) {
  const color = isPositive ? '#00ff88' : '#ff4455';
  const data = prices.map((v, i) => ({ price: v, i }));
  const gradId = `chart-${ticker}`;
  const min = Math.min(...prices) * 0.999;
  const max = Math.max(...prices) * 1.001;

  return (
    <div className="w-full h-14">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={[min, max]} hide />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradId})`}
            dot={false}
            animationDuration={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function MarketPage() {
  const { stockList, isSimulating, toggleSimulation } = useStocks();
  const [sector, setSector] = useState<StockSector | 'All'>('All');
  const [viewTab, setViewTab] = useState<(typeof VIEW_TABS)[number]>('All Stocks');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = [...stockList];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    }
    if (sector !== 'All') list = list.filter((s) => s.sector === sector);
    if (viewTab === 'Gainers') {
      list = list.filter((s) => s.currentPrice >= s.previousClose).sort((a, b) => {
        return (b.currentPrice - b.previousClose) / b.previousClose - (a.currentPrice - a.previousClose) / a.previousClose;
      });
    } else if (viewTab === 'Losers') {
      list = list.filter((s) => s.currentPrice < s.previousClose).sort((a, b) => {
        return (a.currentPrice - a.previousClose) / a.previousClose - (b.currentPrice - b.previousClose) / b.previousClose;
      });
    }
    return list;
  }, [stockList, sector, viewTab, search]);

  return (
    <div className="neon-dashboard -m-4 md:-m-6 p-4 md:p-6 min-h-full bg-[var(--bg-1)]">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold neon-gradient-cyan inline-block">Market</h1>
          <p className="text-sm text-[var(--neon-muted)] mt-1">Live simulated stock prices &middot; Updated every 2 seconds</p>
        </div>
        <button
          onClick={toggleSimulation}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: isSimulating ? 'rgba(0,255,136,0.08)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isSimulating ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.1)'}`,
            color: isSimulating ? '#00ff88' : '#8892b0',
          }}
        >
          <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-[#00ff88] live-dot' : 'bg-[#5a6a8a]'}`} />
          {isSimulating ? 'Live' : 'Paused'}
        </button>
      </motion.div>

      {/* Controls row */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        {/* View Tabs */}
        <div className="flex items-center gap-2">
          {VIEW_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setViewTab(tab)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: viewTab === tab ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${viewTab === tab ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                color: viewTab === tab ? '#00d4ff' : '#8892b0',
              }}
            >
              {tab === 'Gainers' && <span className="inline-block w-2 h-2 rounded-full bg-[#00ff88] mr-2" />}
              {tab === 'Losers' && <span className="inline-block w-2 h-2 rounded-full bg-[#ff4455] mr-2" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative lg:ml-auto lg:w-80">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search stocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-[var(--neon-text)] placeholder-[#5a6a8a] outline-none transition-all focus:border-[rgba(0,212,255,0.3)]"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          />
        </div>
      </div>

      {/* Sector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {SECTOR_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setSector(s)}
            className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: sector === s ? 'rgba(0,212,255,0.1)' : 'transparent',
              border: `1px solid ${sector === s ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
              color: sector === s ? '#00d4ff' : '#5a6a8a',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Stock Cards Grid */}
      {filtered.length === 0 ? (
        <div className="neon-card py-20 text-center text-[var(--text-muted)] text-sm">No stocks match your filters</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((stock) => {
            const change = stock.currentPrice - stock.previousClose;
            const pct = stock.previousClose !== 0 ? change / stock.previousClose : 0;
            const isPositive = change >= 0;
            const color = isPositive ? '#00ff88' : '#ff4455';
            const sparkPrices = stock.priceHistory.slice(-40).map((p) => p.price);

            return (
              <Link
                key={stock.ticker}
                href={`/market/${stock.ticker}`}
                className="neon-card p-0 overflow-hidden transition-all hover:border-[rgba(0,212,255,0.2)] group"
              >
                {/* Top: Stock info + price */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{
                        background: `${color}10`,
                        border: `1px solid ${color}20`,
                        color: color,
                      }}
                    >
                      {stock.ticker.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-base font-bold text-[var(--neon-text)] group-hover:text-[#00d4ff] transition-colors">
                        {stock.ticker}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">{stock.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-[var(--neon-text)]">
                      {formatCurrency(stock.currentPrice)}
                    </div>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md"
                      style={{ background: `${color}12`, color }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isPositive
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />}
                      </svg>
                      {isPositive ? '+' : ''}{formatPercent(pct)}
                    </span>
                  </div>
                </div>

                {/* Chart */}
                <div className="px-2 pb-1">
                  <StockChart prices={sparkPrices} isPositive={isPositive} ticker={stock.ticker} />
                </div>

                {/* Bottom: Meta row */}
                <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md text-[var(--text-secondary)]" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {stock.sector}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] text-[var(--text-muted)] uppercase">Open</div>
                      <div className="text-xs font-semibold text-[var(--text-secondary)]">{formatCurrency(stock.openPrice)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-[var(--text-muted)] uppercase">Mkt Cap</div>
                      <div className="text-xs font-semibold text-[var(--text-secondary)]">{stock.marketCap}</div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
