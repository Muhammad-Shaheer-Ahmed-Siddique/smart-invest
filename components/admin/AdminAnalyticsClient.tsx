'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ComposedChart, Line,
} from 'recharts';
import { useStocks } from '@/hooks/useStocks';
import { getPriceMap } from '@/lib/stockEngine';
import { getAdminUserRows, getMostTradedStocks, getVolumeByDay } from '@/lib/adminData';
import { getAllUsers, getTransactions } from '@/lib/storage';
import { formatCurrency } from '@/lib/formatters';
import { AdminTopbar } from './AdminTopbar';
import { KPICard } from './KPICard';
import { STARTING_CASH } from '@/lib/constants';

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const BAR_COLORS = ['#00d4ff','#7c3aed','#00ff88','#f59e0b','#ff4455','#06b6d4','#8b5cf6','#34d399'];

export function AdminAnalyticsClient() {
  const { stocks } = useStocks();
  const prices = useMemo(() => getPriceMap(stocks), [stocks]);

  const rows = useMemo(() => getAdminUserRows(prices), [prices]);
  const mostTraded = useMemo(() => getMostTradedStocks(10), []);
  const volumeHistory = useMemo(() => getVolumeByDay(14), []);

  // Compute derived analytics
  const analytics = useMemo(() => {
    const users = getAllUsers();
    const allTxns = users.flatMap((u) => getTransactions(u.id));

    const totalVolume = allTxns.reduce((s, t) => s + t.totalValue, 0);
    const buyVolume   = allTxns.filter((t) => t.type === 'BUY').reduce((s, t)  => s + t.totalValue, 0);
    const sellVolume  = allTxns.filter((t) => t.type === 'SELL').reduce((s, t) => s + t.totalValue, 0);

    const winners = rows.filter((r) => r.netWorth > STARTING_CASH).length;
    const losers  = rows.filter((r) => r.netWorth < STARTING_CASH).length;

    const pnlBuckets: Record<string, number> = {
      '<-20%': 0, '-20% to -10%': 0, '-10% to 0%': 0,
      '0% to +10%': 0, '+10% to +20%': 0, '>+20%': 0,
    };
    for (const r of rows) {
      const pct = ((r.netWorth - STARTING_CASH) / STARTING_CASH) * 100;
      if (pct < -20) pnlBuckets['<-20%']++;
      else if (pct < -10) pnlBuckets['-20% to -10%']++;
      else if (pct < 0)   pnlBuckets['-10% to 0%']++;
      else if (pct < 10)  pnlBuckets['0% to +10%']++;
      else if (pct < 20)  pnlBuckets['+10% to +20%']++;
      else                pnlBuckets['>+20%']++;
    }
    const pnlDist = Object.entries(pnlBuckets).map(([range, count]) => ({ range, count }));

    // Net worth leaderboard top 5
    const topUsers = [...rows].sort((a, b) => b.netWorth - a.netWorth).slice(0, 5);

    // Sector radar from most traded
    const radarData = [
      { subject: 'Tech', A: 0 }, { subject: 'Finance', A: 0 }, { subject: 'Health', A: 0 },
      { subject: 'Energy', A: 0 }, { subject: 'Consumer', A: 0 }, { subject: 'Industrial', A: 0 },
    ];
    const sectorMap: Record<string, number> = {
      AAPL: 0, MSFT: 0, GOOGL: 0, NVDA: 0, META: 0,
      JPM: 1, BAC: 1, GS: 1,
      JNJ: 2, PFE: 2, UNH: 2,
      XOM: 3, CVX: 3,
      AMZN: 4, TSLA: 4, NKE: 4,
      CAT: 5, BA: 5,
    };
    for (const t of mostTraded) {
      const idx = sectorMap[t.ticker] ?? -1;
      if (idx >= 0) radarData[idx].A += t.count;
    }

    return { totalVolume, buyVolume, sellVolume, winners, losers, pnlDist, topUsers, radarData };
  }, [rows, mostTraded]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopbar title="Analytics" />

      <div className="flex-1 overflow-y-auto p-6">
        <motion.div className="max-w-screen-xl mx-auto space-y-6"
          variants={containerVariants} initial="hidden" animate="show">

          {/* ── KPIs ── */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard label="Buy Volume"  value={analytics.buyVolume}  prefix="$" accent="green"  delay={0}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>}
              compact
            />
            <KPICard label="Sell Volume" value={analytics.sellVolume} prefix="$" accent="red"    delay={0.1}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>}
              compact
            />
            <KPICard label="Profitable Traders" value={analytics.winners} accent="cyan"   delay={0.2}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              sub={analytics.winners + analytics.losers > 0 ? `${Math.round((analytics.winners / (analytics.winners + analytics.losers)) * 100)}% win rate` : undefined}
              subPositive
            />
            <KPICard label="Loss Makers" value={analytics.losers} accent="red" delay={0.3}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </motion.div>

          {/* ── CHARTS ROW 1 ── */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* 14-day volume with trade count overlay */}
            <div className="xl:col-span-2 rounded-2xl p-5 admin-card">
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--admin-text)' }}>
                14-Day Volume & Trade Count
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={volumeHistory} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="vol14Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#5a6a8a' }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#5a6a8a' }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} width={45} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#5a6a8a' }} tickLine={false} axisLine={false} width={30} />
                  <Tooltip
                    contentStyle={{ background: '#0d1425', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 12, color: '#f0f4ff' }}
                    formatter={(v, n) => [n === 'volume' ? formatCurrency(Number(v)) : Number(v), n === 'volume' ? 'Volume' : 'Trades']}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="volume" stroke="#7c3aed" strokeWidth={2} fill="url(#vol14Grad)" dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="trades" stroke="#00d4ff" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Sector radar */}
            <div className="rounded-2xl p-5 admin-card">
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--admin-text)' }}>Sector Activity</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={analytics.radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#5a6a8a' }} />
                  <Radar name="Trades" dataKey="A" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.15} strokeWidth={2} />
                  <Tooltip
                    contentStyle={{ background: '#0d1425', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 12, color: '#f0f4ff' }}
                    formatter={(v) => [Number(v), 'Trades']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* ── CHARTS ROW 2 ── */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {/* P&L distribution */}
            <div className="rounded-2xl p-5 admin-card">
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--admin-text)' }}>
                P&L Distribution (Users)
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.pnlDist} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 9, fill: '#5a6a8a' }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#5a6a8a' }} tickLine={false} axisLine={false} width={25} />
                  <Tooltip
                    contentStyle={{ background: '#0d1425', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 12, color: '#f0f4ff' }}
                    formatter={(v) => [Number(v), 'Users']}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {analytics.pnlDist.map((d, i) => (
                      <Cell key={i} fill={d.range.startsWith('+') || d.range.startsWith('0') ? '#00ff88' : '#ff4455'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top 5 net worth */}
            <div className="rounded-2xl p-5 admin-card">
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--admin-text)' }}>Top 5 Traders by Net Worth</h3>
              {analytics.topUsers.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-sm" style={{ color: 'var(--admin-muted)' }}>
                  No users registered
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics.topUsers.map((row, i) => {
                    const pct = Math.min(100, (row.netWorth / (analytics.topUsers[0].netWorth || 1)) * 100);
                    const isUp = row.netWorth >= STARTING_CASH;
                    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
                    return (
                      <motion.div
                        key={row.user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <span className="text-lg w-6 flex-shrink-0">{medals[i]}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold truncate" style={{ color: 'var(--admin-text)' }}>
                              {row.user.username}
                            </span>
                            <span className="text-xs font-bold tabular-nums ml-2" style={{ color: isUp ? 'var(--admin-green)' : 'var(--admin-red)' }}>
                              {formatCurrency(row.netWorth)}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                              className="h-full rounded-full"
                              style={{ background: BAR_COLORS[i % BAR_COLORS.length] }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* ── STOCK PERFORMANCE ── */}
          <motion.div variants={itemVariants} className="rounded-2xl p-5 admin-card">
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--admin-text)' }}>
              Live Stock Performance Overview
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--admin-border)' }}>
                    {['Ticker', 'Name', 'Sector', 'Price', 'Change', 'Volatility', 'Est. Volume'].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--admin-muted)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--admin-border)' }}>
                  {Object.values(stocks).map((s) => {
                    const chg = s.currentPrice - s.previousClose;
                    const pct = s.previousClose ? chg / s.previousClose : 0;
                    const isUp = chg >= 0;
                    return (
                      <tr key={s.ticker} className="hover:bg-white/5 transition-colors">
                        <td className="px-3 py-3 font-bold text-xs" style={{ color: 'var(--admin-cyan)' }}>{s.ticker}</td>
                        <td className="px-3 py-3 text-xs" style={{ color: 'var(--admin-text)' }}>{s.name}</td>
                        <td className="px-3 py-3 text-xs" style={{ color: 'var(--admin-muted)' }}>{s.sector}</td>
                        <td className="px-3 py-3 font-bold tabular-nums text-xs" style={{ color: 'var(--admin-text)' }}>
                          {formatCurrency(s.currentPrice)}
                        </td>
                        <td className="px-3 py-3 text-xs font-semibold" style={{ color: isUp ? 'var(--admin-green)' : 'var(--admin-red)' }}>
                          {isUp ? '+' : ''}{(pct * 100).toFixed(2)}%
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <div className="h-full rounded-full" style={{
                                width: `${Math.min(100, s.volatility * 1000)}%`,
                                background: s.volatility > 0.025 ? '#ff4455' : s.volatility > 0.012 ? '#f59e0b' : '#00ff88',
                              }} />
                            </div>
                            <span className="text-xs" style={{ color: 'var(--admin-muted)' }}>{(s.volatility * 100).toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs tabular-nums" style={{ color: 'var(--admin-muted)' }}>
                          {formatCurrency(s.volume * s.currentPrice, true)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          <div className="h-4" />
        </motion.div>
      </div>
    </div>
  );
}
