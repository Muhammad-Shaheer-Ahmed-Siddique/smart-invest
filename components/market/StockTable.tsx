'use client';

import { useState, useMemo } from 'react';
import { useStocks } from '@/hooks/useStocks';
import { StockRow } from './StockRow';
import { Input } from '@/components/ui';
import type { StockSector } from '@/types';

const SECTORS: StockSector[] = [
  'Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial', 'Utilities', 'Materials',
];

export function StockTable() {
  const { stockList, isSimulating, toggleSimulation } = useStocks();
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState<StockSector | 'All'>('All');
  const [sortBy, setSortBy] = useState<'ticker' | 'price' | 'change'>('ticker');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let list = stockList;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      );
    }
    if (sector !== 'All') {
      list = list.filter((s) => s.sector === sector);
    }
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'ticker') cmp = a.ticker.localeCompare(b.ticker);
      else if (sortBy === 'price') cmp = a.currentPrice - b.currentPrice;
      else if (sortBy === 'change') {
        const ac = (a.currentPrice - a.previousClose) / a.previousClose;
        const bc = (b.currentPrice - b.previousClose) / b.previousClose;
        cmp = ac - bc;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [stockList, search, sector, sortBy, sortDir]);

  function handleSort(col: 'ticker' | 'price' | 'change') {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortDir('asc'); }
  }

  return (
    <div className="bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] overflow-hidden">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-[var(--border-color)]">
        <Input
          placeholder="Search stocks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSector('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sector === 'All'
                ? 'bg-brand-500 text-white'
                : 'bg-[var(--bg-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-3)]'
            }`}
          >
            All
          </button>
          {SECTORS.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                sector === s
                  ? 'bg-brand-500 text-white'
                  : 'bg-[var(--bg-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-3)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={toggleSimulation}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            isSimulating
              ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
              : 'bg-[var(--bg-2)] text-[var(--text-muted)]'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-brand-500 animate-pulse' : 'bg-[var(--text-muted)]'}`} />
          {isSimulating ? 'Live' : 'Paused'}
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center px-4 py-2 bg-[var(--bg-1)] text-xs font-medium text-[var(--text-muted)] border-b border-[var(--border-color)]">
        <button
          className="w-48 shrink-0 text-left hover:text-[var(--text-primary)] transition-colors"
          onClick={() => handleSort('ticker')}
        >
          Symbol {sortBy === 'ticker' && (sortDir === 'asc' ? '↑' : '↓')}
        </button>
        <div className="hidden lg:block w-28 shrink-0">Sector</div>
        <button
          className="flex-1 text-left hover:text-[var(--text-primary)] transition-colors"
          onClick={() => handleSort('price')}
        >
          Price {sortBy === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
        </button>
        <button
          className="w-24 text-right hover:text-[var(--text-primary)] transition-colors"
          onClick={() => handleSort('change')}
        >
          Change {sortBy === 'change' && (sortDir === 'asc' ? '↑' : '↓')}
        </button>
        <div className="hidden md:block w-24 text-right">Mkt Cap</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[var(--border-color)]">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-[var(--text-muted)] text-sm">
            No stocks match your search
          </div>
        ) : (
          filtered.map((stock) => <StockRow key={stock.ticker} stock={stock} />)
        )}
      </div>
    </div>
  );
}
