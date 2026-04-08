'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency, formatPercent } from '@/lib/formatters';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { ease: [0.16, 1, 0.3, 1] as const, duration: 0.5 } },
};

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <div className="w-16 h-8 sparkline-container">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
          <defs>
            <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#spark-${color.replace('#', '')})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function StockRow({
  stock,
  rank,
  type,
}: {
  stock: ReturnType<typeof useStocks>['stockList'][0];
  rank: number;
  type: 'gain' | 'loss';
}) {
  const change = stock.currentPrice - stock.previousClose;
  const pct = stock.previousClose !== 0 ? change / stock.previousClose : 0;
  const color = type === 'gain' ? '#00ff88' : '#ff4455';
  const sparkData = stock.priceHistory.slice(-20).map((p) => p.price);

  return (
    <motion.div variants={itemVariants}>
      <Link
        href={`/market/${stock.ticker}`}
        className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-white/[0.03] transition-all group"
      >
        {/* Rank badge */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background: `${color}12`,
            color: color,
            border: `1px solid ${color}25`,
          }}
        >
          {rank}
        </div>

        {/* Ticker & name */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-[var(--neon-text)] group-hover:text-[var(--neon-cyan)] transition-colors">
            {stock.ticker}
          </div>
          <div className="text-xs text-[var(--neon-muted)] truncate">{stock.name}</div>
        </div>

        {/* Sparkline */}
        <MiniSparkline data={sparkData} color={color} />

        {/* Price & change */}
        <div className="text-right flex-shrink-0">
          <div className="text-sm font-semibold text-[var(--neon-text)]">
            {formatCurrency(stock.currentPrice)}
          </div>
          <div
            className="text-xs font-semibold"
            style={{ color }}
          >
            {type === 'gain' ? '+' : ''}{formatPercent(pct)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function NeonTopMovers() {
  const { stockList } = useStocks();

  const { gainers, losers } = useMemo(() => {
    const sorted = [...stockList].sort((a, b) => {
      const aP = (a.currentPrice - a.previousClose) / a.previousClose;
      const bP = (b.currentPrice - b.previousClose) / b.previousClose;
      return bP - aP;
    });
    return { gainers: sorted.slice(0, 5), losers: sorted.slice(-5).reverse() };
  }, [stockList]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Top Gainers */}
      <div className="neon-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88]" style={{ boxShadow: '0 0 8px rgba(0,255,136,0.5)' }} />
          <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--neon-text)]">
            Top Gainers
          </h3>
          <svg className="w-4 h-4 text-[#00ff88] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-0.5"
        >
          {gainers.map((s, i) => (
            <StockRow key={s.ticker} stock={s} rank={i + 1} type="gain" />
          ))}
        </motion.div>
      </div>

      {/* Top Losers */}
      <div className="neon-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff4455]" style={{ boxShadow: '0 0 8px rgba(255,68,85,0.5)' }} />
          <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--neon-text)]">
            Top Losers
          </h3>
          <svg className="w-4 h-4 text-[#ff4455] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-0.5"
        >
          {losers.map((s, i) => (
            <StockRow key={s.ticker} stock={s} rank={i + 1} type="loss" />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
