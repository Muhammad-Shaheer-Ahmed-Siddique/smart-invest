'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';

const TABS = ['All', 'Gainers', 'Losers', 'Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer'] as const;
type Tab = (typeof TABS)[number];

export function MarketOverviewSection() {
  const { stockList } = useStocks();
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const filteredStocks = useMemo(() => {
    let list = [...stockList];
    if (activeTab === 'Gainers') {
      list = list.filter((s) => s.currentPrice > s.previousClose).sort((a, b) => (b.currentPrice - b.previousClose) / b.previousClose - (a.currentPrice - a.previousClose) / a.previousClose);
    } else if (activeTab === 'Losers') {
      list = list.filter((s) => s.currentPrice < s.previousClose).sort((a, b) => (a.currentPrice - a.previousClose) / a.previousClose - (b.currentPrice - b.previousClose) / b.previousClose);
    } else if (activeTab !== 'All') {
      list = list.filter((s) => s.sector === activeTab);
    }
    return list.slice(0, 10);
  }, [stockList, activeTab]);

  return (
    <section id="market-overview" className="w-full py-20 md:py-28 bg-[var(--bg-1)]">
      <div className="w-full px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] mb-4">Market Overview</h2>
          <p className="text-[var(--text-muted)] text-lg md:text-xl max-w-3xl mx-auto">Real-time simulated prices for 20+ popular stocks across 8 sectors</p>
        </motion.div>

        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                  : 'bg-[var(--bg-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {filteredStocks.map((stock) => {
            const change = stock.currentPrice - stock.previousClose;
            const pct = stock.previousClose !== 0 ? change / stock.previousClose : 0;
            const isPositive = change >= 0;

            return (
              <Link
                key={stock.ticker}
                href="/login"
                className="bg-[var(--bg-0)] rounded-2xl border border-[var(--border-color)] p-5 hover:shadow-xl hover:border-teal-500/30 transition-all group hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{
                      background: isPositive ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.08)',
                      color: isPositive ? '#059669' : '#dc2626',
                    }}
                  >
                    {stock.ticker.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-base font-bold text-[var(--text-primary)] group-hover:text-teal-500 transition-colors">{stock.ticker}</div>
                    <div className="text-xs text-[var(--text-muted)] truncate max-w-[110px]">{stock.name}</div>
                  </div>
                </div>

                <div className="text-xl font-extrabold text-[var(--text-primary)] mb-2">{formatCurrency(stock.currentPrice)}</div>

                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{
                      background: isPositive ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.08)',
                      color: isPositive ? '#059669' : '#dc2626',
                    }}
                  >
                    {isPositive ? '\u2191' : '\u2193'} {isPositive ? '+' : ''}{formatPercent(pct)}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">{stock.sector}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 text-teal-500 font-bold text-base hover:bg-[var(--bg-2)] rounded-xl transition-colors">
            View All Stocks
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
