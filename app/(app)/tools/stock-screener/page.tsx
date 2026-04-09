'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import type { StockSector } from '@/types';

const SECTORS: (StockSector | 'All')[] = ['All', 'Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial', 'Utilities', 'Materials'];
const SORT_OPTIONS = ['Ticker', 'Price High', 'Price Low', 'Change High', 'Change Low', 'Volatility High'] as const;

export default function StockScreenerPage() {
  const { stockList } = useStocks();
  const [sector, setSector] = useState<StockSector | 'All'>('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]>('Ticker');

  const filtered = useMemo(() => {
    let list = [...stockList];
    if (sector !== 'All') list = list.filter((s) => s.sector === sector);
    if (minPrice) list = list.filter((s) => s.currentPrice >= parseFloat(minPrice));
    if (maxPrice) list = list.filter((s) => s.currentPrice <= parseFloat(maxPrice));

    switch (sortBy) {
      case 'Price High': list.sort((a, b) => b.currentPrice - a.currentPrice); break;
      case 'Price Low': list.sort((a, b) => a.currentPrice - b.currentPrice); break;
      case 'Change High': list.sort((a, b) => (b.currentPrice - b.previousClose) / b.previousClose - (a.currentPrice - a.previousClose) / a.previousClose); break;
      case 'Change Low': list.sort((a, b) => (a.currentPrice - a.previousClose) / a.previousClose - (b.currentPrice - b.previousClose) / b.previousClose); break;
      case 'Volatility High': list.sort((a, b) => b.volatility - a.volatility); break;
      default: list.sort((a, b) => a.ticker.localeCompare(b.ticker));
    }
    return list;
  }, [stockList, sector, minPrice, maxPrice, sortBy]);

  return (
    <div className="neon-dashboard -m-4 md:-m-6 p-4 md:p-6 min-h-full bg-[var(--bg-1)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Stock Screener</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Filter and sort stocks by your criteria</p>
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-0)] rounded-2xl border border-[var(--border-color)] p-5 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase">Sector</label>
            <select value={sector} onChange={(e) => setSector(e.target.value as StockSector | 'All')} className="w-full px-3 py-2.5 rounded-xl text-sm bg-[var(--bg-1)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
              {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase">Min Price</label>
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" className="w-full px-3 py-2.5 rounded-xl text-sm bg-[var(--bg-1)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase">Max Price</label>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="999" className="w-full px-3 py-2.5 rounded-xl text-sm bg-[var(--bg-1)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase">Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="w-full px-3 py-2.5 rounded-xl text-sm bg-[var(--bg-1)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
              {SORT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-[var(--bg-0)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
        <div className="flex items-center px-5 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)]">
          <div className="w-44">Stock</div>
          <div className="w-24">Sector</div>
          <div className="w-28 text-right">Price</div>
          <div className="w-28 text-right">Change</div>
          <div className="w-24 text-right hidden md:block">Volatility</div>
          <div className="w-24 text-right hidden lg:block">Mkt Cap</div>
        </div>
        <div className="text-sm text-[var(--text-muted)] px-5 py-2 border-b border-[var(--border-color)] bg-[var(--bg-1)]">
          {filtered.length} stocks found
        </div>
        {filtered.map((stock) => {
          const change = stock.currentPrice - stock.previousClose;
          const pct = stock.previousClose !== 0 ? change / stock.previousClose : 0;
          const isPositive = change >= 0;
          const color = isPositive ? '#00ff88' : '#ff4455';
          return (
            <Link key={stock.ticker} href={`/market/${stock.ticker}`} className="flex items-center px-5 py-3.5 hover:bg-[var(--bg-1)] transition-colors border-b border-[var(--border-color)] last:border-0 group">
              <div className="w-44 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: `${color}10`, color }}>{stock.ticker.slice(0, 2)}</div>
                <div>
                  <div className="font-bold text-[var(--text-primary)] group-hover:text-[#00d4ff] transition-colors">{stock.ticker}</div>
                  <div className="text-xs text-[var(--text-muted)] truncate max-w-[100px]">{stock.name}</div>
                </div>
              </div>
              <div className="w-24"><span className="text-xs px-2 py-1 rounded-md bg-[var(--bg-1)] text-[var(--text-secondary)]">{stock.sector}</span></div>
              <div className="w-28 text-right font-bold text-[var(--text-primary)]">{formatCurrency(stock.currentPrice)}</div>
              <div className="w-28 text-right"><span className="text-xs font-bold px-2 py-1 rounded-md" style={{ background: `${color}12`, color }}>{isPositive ? '+' : ''}{formatPercent(pct)}</span></div>
              <div className="w-24 text-right hidden md:block text-[var(--text-secondary)]">{(stock.volatility * 100).toFixed(1)}%</div>
              <div className="w-24 text-right hidden lg:block text-[var(--text-secondary)]">{stock.marketCap}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
