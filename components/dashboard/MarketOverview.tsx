'use client';

import { useMemo } from 'react';
import { useStocks } from '@/hooks/useStocks';
import { formatPercent } from '@/lib/formatters';
import type { StockSector } from '@/types';

const ALL_SECTORS: StockSector[] = [
  'Technology', 'Finance', 'Healthcare', 'Energy',
  'Consumer', 'Industrial', 'Utilities', 'Materials',
];

const SECTOR_LABELS: Record<StockSector, string> = {
  Technology: 'Tech',
  Finance: 'Finance',
  Healthcare: 'Health',
  Energy: 'Energy',
  Consumer: 'Consumer',
  Industrial: 'Industry',
  Utilities: 'Utilities',
  Materials: 'Materials',
};

const SECTOR_ICONS: Record<StockSector, React.ReactNode> = {
  Technology: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Finance: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Healthcare: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Energy: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Consumer: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  Industrial: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  Utilities: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Materials: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
};

export function MarketOverview() {
  const { stockList } = useStocks();

  const sectorData = useMemo(() => {
    const map = new Map<StockSector, number[]>();
    for (const s of ALL_SECTORS) map.set(s, []);

    for (const stock of stockList) {
      const change = stock.previousClose !== 0
        ? (stock.currentPrice - stock.previousClose) / stock.previousClose
        : 0;
      map.get(stock.sector)?.push(change);
    }

    return ALL_SECTORS.map((sector) => {
      const changes = map.get(sector) || [];
      const avg = changes.length > 0 ? changes.reduce((a, b) => a + b, 0) / changes.length : 0;
      return { sector, avgChange: avg, stockCount: changes.length };
    });
  }, [stockList]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-[#00d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <h2 className="text-sm font-bold tracking-wider uppercase text-[var(--text-primary)]">
          Sector Performance
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {sectorData.map((s) => {
          const isPositive = s.avgChange >= 0;
          const color = isPositive ? '#00ff88' : '#ff4455';

          return (
            <div
              key={s.sector}
              className="rounded-xl p-4 relative overflow-hidden cursor-default border border-[var(--border-color)] bg-[var(--bg-0)] transition-all hover:border-[var(--bg-3)]"
            >
              <div className="mb-3" style={{ color: `${color}99` }}>
                {SECTOR_ICONS[s.sector]}
              </div>

              <div className="text-sm font-bold text-[var(--text-primary)] mb-1">
                {SECTOR_LABELS[s.sector]}
              </div>

              <div className="text-lg font-bold mb-1" style={{ color }}>
                {isPositive ? '+' : ''}{formatPercent(s.avgChange)}
              </div>

              <div className="text-xs text-[var(--text-muted)]">
                {s.stockCount} stocks
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
