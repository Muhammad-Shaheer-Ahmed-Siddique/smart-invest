'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import type { StockSector } from '@/types';

const ALL_SECTORS: StockSector[] = ['Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial', 'Utilities', 'Materials'];

export default function SectorHeatmapPage() {
  const { stockList } = useStocks();
  const [expanded, setExpanded] = useState<StockSector | null>(null);

  const sectorData = useMemo(() => {
    return ALL_SECTORS.map((sector) => {
      const sectorStocks = stockList.filter((s) => s.sector === sector);
      const changes = sectorStocks.map((s) => s.previousClose !== 0 ? (s.currentPrice - s.previousClose) / s.previousClose : 0);
      const avg = changes.length > 0 ? changes.reduce((a, b) => a + b, 0) / changes.length : 0;
      return { sector, avgChange: avg, stocks: sectorStocks };
    });
  }, [stockList]);

  const maxAbs = Math.max(...sectorData.map((s) => Math.abs(s.avgChange)), 0.001);

  return (
    <div className="neon-dashboard -m-4 md:-m-6 p-4 md:p-6 min-h-full bg-[var(--bg-1)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sector Heatmap</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Click a sector to see individual stocks</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sectorData.map((s) => {
          const isPositive = s.avgChange >= 0;
          const color = isPositive ? '#00ff88' : '#ff4455';
          const intensity = Math.min(Math.abs(s.avgChange) / maxAbs, 1);
          const isExpanded = expanded === s.sector;

          return (
            <div key={s.sector} className={isExpanded ? 'col-span-2 lg:col-span-4' : ''}>
              <button
                onClick={() => setExpanded(isExpanded ? null : s.sector)}
                className="w-full text-left rounded-2xl border border-[var(--border-color)] p-6 transition-all hover:border-[var(--bg-3)]"
                style={{ background: `linear-gradient(135deg, ${color}${Math.round(intensity * 15).toString(16).padStart(2, '0')}, var(--bg-0))` }}
              >
                <div className="text-lg font-bold text-[var(--text-primary)] mb-1">{s.sector}</div>
                <div className="text-2xl font-extrabold mb-1" style={{ color }}>{isPositive ? '+' : ''}{formatPercent(s.avgChange)}</div>
                <div className="text-xs text-[var(--text-muted)]">{s.stocks.length} stocks</div>
              </button>

              {isExpanded && (
                <div className="mt-3 bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] overflow-hidden">
                  {s.stocks.map((stock) => {
                    const change = stock.currentPrice - stock.previousClose;
                    const pct = stock.previousClose !== 0 ? change / stock.previousClose : 0;
                    const sc = change >= 0 ? '#00ff88' : '#ff4455';
                    return (
                      <Link key={stock.ticker} href={`/market/${stock.ticker}`} className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-1)] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: `${sc}10`, color: sc }}>{stock.ticker.slice(0, 2)}</div>
                          <div>
                            <div className="text-sm font-bold text-[var(--text-primary)]">{stock.ticker}</div>
                            <div className="text-xs text-[var(--text-muted)]">{stock.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-[var(--text-primary)]">{formatCurrency(stock.currentPrice)}</div>
                          <div className="text-xs font-bold" style={{ color: sc }}>{change >= 0 ? '+' : ''}{formatPercent(pct)}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
