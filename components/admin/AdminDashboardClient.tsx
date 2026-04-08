'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend,
} from 'recharts';
import { useStocks } from '@/hooks/useStocks';
import { getPriceMap } from '@/lib/stockEngine';
import { getAdminStats, getMostTradedStocks, getVolumeByDay, getSectorVolume } from '@/lib/adminData';
import { formatCurrency } from '@/lib/formatters';
import { KPICard } from './KPICard';
import { ActivityFeed } from './ActivityFeed';
import { AdminTopbar } from './AdminTopbar';

const BAR_COLORS = ['#00d4ff','#7c3aed','#00ff88','#f59e0b','#ff4455','#06b6d4','#8b5cf6','#34d399'];
const PIE_COLORS = ['#00d4ff','#7c3aed','#00ff88','#f59e0b','#ff4455','#06b6d4','#8b5cf6'];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const rowVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={rowVariants} className="flex items-center gap-3">
      <h2 className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--admin-muted)' }}>
        {children}
      </h2>
      <div className="flex-1 h-px" style={{ background: 'var(--admin-border)' }} />
    </motion.div>
  );
}

function GlassCard({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      variants={rowVariants}
      className={`rounded-2xl p-5 admin-card ${className}`}
      style={{ ...style }}
    >
      {children}
    </motion.div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--admin-text)' }}>{children}</h3>;
}

export function AdminDashboardClient() {
  const { stocks } = useStocks();
  const prices = useMemo(() => getPriceMap(stocks), [stocks]);

  const stats   = useMemo(() => getAdminStats(prices),     [prices]);
  const mostTraded = useMemo(() => getMostTradedStocks(8), []);
  const volumeData = useMemo(() => getVolumeByDay(7),      []);
  const sectorData = useMemo(() => getSectorVolume(),      []);

  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ background: 'var(--admin-bg)' }}>
      <AdminTopbar title="Dashboard" />

      <div className="flex-1 overflow-y-auto">
        <motion.div
          className="max-w-screen-xl mx-auto p-6 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* ── KPI ROW ── */}
          <SectionTitle>Overview</SectionTitle>

          <motion.div variants={rowVariants} className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <KPICard
              label="Total Users" value={stats.totalUsers} accent="cyan" delay={0}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              sub={stats.totalUsers > 0 ? 'Registered' : undefined}
            />
            <KPICard
              label="Total Trades" value={stats.totalTrades} accent="purple" delay={0.1}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            />
            <KPICard
              label="Trading Volume" value={stats.totalVolume} prefix="$" accent="green" delay={0.2}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              compact
            />
            <KPICard
              label="Avg Net Worth" value={stats.avgNetWorth} prefix="$" accent="gold" delay={0.3}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
              compact
            />
          </motion.div>

          {/* ── CHARTS ROW 1 ── */}
          <SectionTitle>Trading Activity</SectionTitle>

          <motion.div variants={rowVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Volume chart */}
            <div className="xl:col-span-2 rounded-2xl p-5 admin-card">
              <CardLabel>7-Day Trading Volume</CardLabel>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={volumeData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#00d4ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="tradeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5a6a8a' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#5a6a8a' }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} width={50} />
                  <Tooltip
                    contentStyle={{ background: '#0d1425', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 12, color: '#f0f4ff' }}
                    formatter={(v, n) => [n === 'volume' ? formatCurrency(Number(v)) : Number(v), n === 'volume' ? 'Volume' : 'Trades']}
                  />
                  <Area type="monotone" dataKey="volume" stroke="#00d4ff" strokeWidth={2} fill="url(#volGrad)" dot={false} activeDot={{ r: 4, fill: '#00d4ff' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Sector pie */}
            <div className="rounded-2xl p-5 admin-card">
              <CardLabel>Volume by Sector</CardLabel>
              {sectorData.length === 0 ? (
                <div className="flex items-center justify-center h-44 text-sm" style={{ color: 'var(--admin-muted)' }}>
                  No trades yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={sectorData} cx="50%" cy="45%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="volume">
                      {sectorData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#0d1425', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 12, color: '#f0f4ff' }}
                      formatter={(v) => [formatCurrency(Number(v)), 'Volume']}
                    />
                    <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 10, color: '#5a6a8a' }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* ── CHARTS ROW 2 ── */}
          <motion.div variants={rowVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Most traded */}
            <div className="xl:col-span-2 rounded-2xl p-5 admin-card">
              <CardLabel>Most Traded Stocks</CardLabel>
              {mostTraded.length === 0 ? (
                <div className="flex items-center justify-center h-44 text-sm" style={{ color: 'var(--admin-muted)' }}>
                  No trades yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={mostTraded} layout="vertical" margin={{ top: 0, right: 15, bottom: 0, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#5a6a8a' }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="ticker" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} tickLine={false} axisLine={false} width={45} />
                    <Tooltip
                      contentStyle={{ background: '#0d1425', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 12, color: '#f0f4ff' }}
                      formatter={(v) => [Number(v), 'Trades']}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {mostTraded.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Activity feed */}
            <div className="rounded-2xl p-5 admin-card">
              <CardLabel>Recent Activity</CardLabel>
              <ActivityFeed />
            </div>
          </motion.div>

          {/* ── LIVE MARKET STRIP ── */}
          <SectionTitle>Live Market</SectionTitle>

          <motion.div variants={rowVariants} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {Object.values(stocks).slice(0, 10).map((stock) => {
              const chg = stock.currentPrice - stock.previousClose;
              const pct = stock.previousClose ? chg / stock.previousClose : 0;
              const pos = chg >= 0;
              return (
                <motion.div
                  key={stock.ticker}
                  whileHover={{ scale: 1.04 }}
                  className="rounded-xl p-3 admin-card text-center"
                >
                  <div className="text-xs font-bold mb-1" style={{ color: 'var(--admin-cyan)' }}>{stock.ticker}</div>
                  <div className="text-sm font-bold tabular-nums" style={{ color: 'var(--admin-text)' }}>
                    ${stock.currentPrice.toFixed(2)}
                  </div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: pos ? 'var(--admin-green)' : 'var(--admin-red)' }}>
                    {pos ? '+' : ''}{(pct * 100).toFixed(2)}%
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* spacer */}
          <div className="h-4" />
        </motion.div>
      </div>
    </div>
  );
}
