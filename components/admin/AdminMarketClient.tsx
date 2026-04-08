'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency } from '@/lib/formatters';
import { AdminTopbar } from './AdminTopbar';
import type { MarketEventType } from '@/types';

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const MARKET_EVENTS: {
  type: MarketEventType; label: string; desc: string;
  color: string; bg: string; border: string; icon: string; glow: string;
}[] = [
  {
    type: 'bull_run',
    label: 'Bull Run',
    desc: 'Strong upward trend, elevated volatility',
    color: '#00ff88', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.25)',
    icon: '🚀', glow: '0 0 30px rgba(0,255,136,0.2)',
  },
  {
    type: 'bear_market',
    label: 'Bear Market',
    desc: 'Sustained decline across all sectors',
    color: '#ff4455', bg: 'rgba(255,68,85,0.08)', border: 'rgba(255,68,85,0.25)',
    icon: '🐻', glow: '0 0 30px rgba(255,68,85,0.2)',
  },
  {
    type: 'black_swan',
    label: 'Black Swan',
    desc: 'Extreme crash — extreme volatility',
    color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.25)',
    icon: '🦢', glow: '0 0 30px rgba(124,58,237,0.3)',
  },
  {
    type: 'recovery',
    label: 'Recovery',
    desc: 'Gradual recovery, low volatility',
    color: '#00d4ff', bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.25)',
    icon: '📈', glow: '0 0 30px rgba(0,212,255,0.2)',
  },
  {
    type: 'normal',
    label: 'Normal',
    desc: 'Standard market conditions',
    color: '#94a3b8', bg: 'rgba(148,163,184,0.06)', border: 'rgba(148,163,184,0.15)',
    icon: '⚖️', glow: 'none',
  },
];

function StockPriceCard({ stock }: { stock: { ticker: string; name: string; currentPrice: number; previousClose: number; volatility: number } }) {
  const { setStockPrice } = useStocks();
  const [localPrice, setLocalPrice] = useState(stock.currentPrice.toFixed(2));
  const [editing, setEditing] = useState(false);

  const chg = stock.currentPrice - stock.previousClose;
  const pct = stock.previousClose ? chg / stock.previousClose : 0;
  const isUp = chg >= 0;

  function applyPrice() {
    const p = parseFloat(localPrice);
    if (p > 0) setStockPrice(stock.ticker, p);
    setEditing(false);
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
      className="rounded-xl p-4 admin-card"
      style={{ border: `1px solid ${isUp ? 'rgba(0,255,136,0.15)' : 'rgba(255,68,85,0.15)'}` }}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm font-bold" style={{ color: 'var(--admin-cyan)' }}>{stock.ticker}</div>
          <div className="text-xs truncate max-w-[100px]" style={{ color: 'var(--admin-muted)' }}>{stock.name}</div>
        </div>
        <div className="text-right">
          <div className="text-base font-bold tabular-nums" style={{ color: 'var(--admin-text)' }}>
            ${stock.currentPrice.toFixed(2)}
          </div>
          <div className="text-xs font-medium" style={{ color: isUp ? 'var(--admin-green)' : 'var(--admin-red)' }}>
            {isUp ? '+' : ''}{(pct * 100).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Manual price edit */}
      {editing ? (
        <div className="flex gap-1.5 mt-2">
          <input
            type="number"
            value={localPrice}
            onChange={(e) => setLocalPrice(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
            className="flex-1 px-2 py-1.5 rounded-lg text-xs outline-none tabular-nums"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(0,212,255,0.3)', color: 'var(--admin-text)', caretColor: 'var(--admin-cyan)' }}
            autoFocus
          />
          <motion.button whileTap={{ scale: 0.95 }} onClick={applyPrice}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: 'rgba(0,212,255,0.15)', color: 'var(--admin-cyan)', border: '1px solid rgba(0,212,255,0.3)' }}>
            Set
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setEditing(false)}
            className="px-2 py-1.5 rounded-lg text-xs"
            style={{ color: 'var(--admin-muted)' }}>
            ✕
          </motion.button>
        </div>
      ) : (
        <motion.button
          whileHover={{ opacity: 1 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => setEditing(true)}
          className="w-full mt-2 py-1 rounded-lg text-xs font-medium transition-colors hover:bg-white/10"
          style={{ color: 'var(--admin-muted)', border: '1px solid rgba(255,255,255,0.07)' }}>
          Override Price
        </motion.button>
      )}
    </motion.div>
  );
}

export function AdminMarketClient() {
  const { stocks, isSimulating, toggleSimulation, marketEvent, setMarketEvent, resetAllPrices } = useStocks();
  const [activeEvent, setActiveEvent] = useState<MarketEventType>(marketEvent);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const stockList = useMemo(() => Object.values(stocks), [stocks]);

  function handleEventSelect(evt: MarketEventType) {
    setActiveEvent(evt);
    setMarketEvent(evt);
  }

  function handleReset() {
    resetAllPrices();
    setActiveEvent('normal');
    setShowResetConfirm(false);
  }

  const totalVolume = stockList.reduce((s, st) => s + st.volume * st.currentPrice, 0);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopbar title="Market Controls" />

      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          className="max-w-screen-xl mx-auto space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* ── GLOBAL CONTROLS ── */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
            {/* Simulate toggle */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={toggleSimulation}
              className="flex items-center gap-3 px-5 py-3 rounded-xl font-semibold text-sm"
              style={isSimulating
                ? { background: 'rgba(0,255,136,0.12)', color: 'var(--admin-green)', border: '1px solid rgba(0,255,136,0.3)', boxShadow: '0 0 20px rgba(0,255,136,0.15)' }
                : { background: 'rgba(255,68,85,0.12)',  color: 'var(--admin-red)',   border: '1px solid rgba(255,68,85,0.3)',  boxShadow: '0 0 20px rgba(255,68,85,0.15)'  }
              }
            >
              <motion.span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: isSimulating ? 'var(--admin-green)' : 'var(--admin-red)' }}
                animate={{ opacity: isSimulating ? [1, 0.3, 1] : 1 }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              {isSimulating ? 'Simulation Running' : 'Simulation Paused'} — Click to {isSimulating ? 'Pause' : 'Resume'}
            </motion.button>

            {/* Reset all */}
            {showResetConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: 'var(--admin-muted)' }}>Reset all prices?</span>
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleReset}
                  className="px-3 py-2 rounded-xl text-sm font-bold"
                  style={{ background: 'rgba(255,68,85,0.15)', color: 'var(--admin-red)', border: '1px solid rgba(255,68,85,0.3)' }}>
                  Confirm Reset
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-2 rounded-xl text-sm" style={{ color: 'var(--admin-muted)' }}>
                  Cancel
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--admin-muted)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset All to Seed Prices
              </motion.button>
            )}

            {/* Volume stat */}
            <div className="ml-auto text-right hidden sm:block">
              <div className="text-xs" style={{ color: 'var(--admin-muted)' }}>Simulated Volume</div>
              <div className="text-lg font-bold gradient-text-cyan">{formatCurrency(totalVolume, true)}</div>
            </div>
          </motion.div>

          {/* ── MARKET EVENTS ── */}
          <motion.div variants={itemVariants}>
            <h2 className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--admin-muted)' }}>
              Market Event Simulator
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {MARKET_EVENTS.map((ev) => {
                const isSelected = activeEvent === ev.type;
                return (
                  <motion.button
                    key={ev.type}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleEventSelect(ev.type)}
                    className="relative rounded-2xl p-4 text-left transition-all cursor-pointer overflow-hidden"
                    style={{
                      background: isSelected ? ev.bg : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isSelected ? ev.border : 'rgba(255,255,255,0.07)'}`,
                      boxShadow: isSelected ? ev.glow : 'none',
                    }}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="event-active"
                        className="absolute inset-0 rounded-2xl"
                        style={{ background: `${ev.color}08`, border: `1px solid ${ev.border}` }}
                      />
                    )}
                    <div className="relative">
                      <div className="text-2xl mb-2">{ev.icon}</div>
                      <div className="text-sm font-bold mb-1" style={{ color: isSelected ? ev.color : 'var(--admin-text)' }}>
                        {ev.label}
                      </div>
                      <div className="text-xs leading-relaxed" style={{ color: 'var(--admin-muted)' }}>{ev.desc}</div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
                        style={{ background: ev.color, boxShadow: `0 0 8px ${ev.color}` }} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ── STOCK GRID ── */}
          <motion.div variants={itemVariants}>
            <h2 className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--admin-muted)' }}>
              Individual Stock Controls ({stockList.length} stocks)
            </h2>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {stockList.map((stock) => (
                <StockPriceCard key={stock.ticker} stock={stock} />
              ))}
            </motion.div>
          </motion.div>

          <div className="h-4" />
        </motion.div>
      </div>
    </div>
  );
}
