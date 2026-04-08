'use client';

import { motion } from 'framer-motion';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { calculatePortfolioValue } from '@/lib/portfolio';
import { MarketTickerTape } from '@/components/dashboard/MarketTickerTape';
import { LiveStockCarousel } from '@/components/dashboard/LiveStockCarousel';
import { NeonStatCard } from '@/components/dashboard/NeonStatCard';
import { NeonTopMovers } from '@/components/dashboard/NeonTopMovers';
import { NeonWatchlist } from '@/components/dashboard/NeonWatchlist';
import { MarketOverview } from '@/components/dashboard/MarketOverview';

function DashboardStatsRow() {
  const { portfolio, currentNetWorth } = usePortfolio();
  const { stocks } = useStocks();

  if (!portfolio) return null;

  const prices: Record<string, number> = {};
  for (const t in stocks) prices[t] = stocks[t].currentPrice;

  const portfolioValue = calculatePortfolioValue(portfolio.holdings, prices);
  const totalInvested = Object.values(portfolio.holdings).reduce((s, h) => s + h.totalInvested, 0);
  const pnl = portfolioValue - totalInvested;
  const pnlPercent = totalInvested !== 0 ? pnl / totalInvested : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <NeonStatCard
        label="Net Worth"
        value={formatCurrency(currentNetWorth)}
        glowClass="neon-stat-cyan"
        accentColor="#00d4ff"
        delay={0}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <NeonStatCard
        label="Cash Balance"
        value={formatCurrency(portfolio.cashBalance)}
        glowClass="neon-stat-green"
        accentColor="#00ff88"
        delay={0.1}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />
      <NeonStatCard
        label="Invested Value"
        value={formatCurrency(portfolioValue)}
        sub={`${Object.keys(portfolio.holdings).length} positions`}
        glowClass="neon-stat-purple"
        accentColor="#a855f7"
        delay={0.2}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
      />
      <NeonStatCard
        label="Unrealized P&L"
        value={formatCurrency(pnl)}
        sub={`${pnlPercent >= 0 ? '+' : ''}${formatPercent(pnlPercent)}`}
        positive={pnl >= 0}
        glowClass="neon-stat-gold"
        accentColor="#fbbf24"
        delay={0.3}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="neon-dashboard -m-4 md:-m-6 p-4 md:p-6 min-h-full bg-[var(--bg-1)]">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold neon-gradient-cyan inline-block">Dashboard</h1>
        <p className="text-sm text-[var(--neon-muted)] mt-1">Real-time market data & portfolio overview</p>
      </motion.div>

      {/* Ticker tape */}
      <MarketTickerTape />

      {/* Hero: Live Stock Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-6"
      >
        <LiveStockCarousel />
      </motion.div>

      {/* Stat cards */}
      <DashboardStatsRow />

      {/* Top Movers + Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2">
          <NeonTopMovers />
        </div>
        <div>
          <NeonWatchlist />
        </div>
      </div>

      {/* Sector Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6"
      >
        <MarketOverview />
      </motion.div>
    </div>
  );
}
