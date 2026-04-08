'use client';

import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStocks } from '@/hooks/useStocks';
import { getPriceMap } from '@/lib/stockEngine';
import { getAdminUserRows } from '@/lib/adminData';
import { getAllUsers, saveUser, savePortfolio, getPortfolio } from '@/lib/storage';
import { formatCurrency, formatRelativeTime } from '@/lib/formatters';
import { Avatar } from '@/components/ui';
import { AdminTopbar } from './AdminTopbar';
import type { AdminUserRow } from '@/types';
import { STARTING_CASH } from '@/lib/constants';

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const rowVariants = { hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } };

function NetWorthBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const color = value > STARTING_CASH ? '#00ff88' : '#ff4455';
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums w-24 text-right" style={{ color }}>
        {formatCurrency(value)}
      </span>
    </div>
  );
}

function UserDetailModal({ row, onClose }: { row: AdminUserRow; onClose: () => void }) {
  const gainLoss = row.netWorth - STARTING_CASH;
  const gainPct  = (gainLoss / STARTING_CASH) * 100;
  const isUp     = gainLoss >= 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-md rounded-2xl p-6 admin-card"
        style={{ border: '1px solid rgba(0,212,255,0.2)', boxShadow: '0 0 60px rgba(0,212,255,0.1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-sm p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          style={{ color: 'var(--admin-muted)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar initials={row.user.avatarInitials} size="lg" />
            {row.user.isAdmin && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: 'var(--admin-cyan)', fontSize: 8 }}>★</div>
            )}
          </div>
          <div>
            <div className="font-bold text-lg" style={{ color: 'var(--admin-text)' }}>
              {row.user.username}
              {row.user.isAdmin && <span className="ml-2 text-xs gradient-text-cyan font-normal">Admin</span>}
            </div>
            <div className="text-sm" style={{ color: 'var(--admin-muted)' }}>{row.user.email}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--admin-muted)' }}>
              Joined {formatRelativeTime(row.user.createdAt)}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'Net Worth', value: formatCurrency(row.netWorth), color: isUp ? 'var(--admin-green)' : 'var(--admin-red)' },
            { label: 'Cash Balance', value: formatCurrency(row.cashBalance), color: 'var(--admin-cyan)' },
            { label: 'Portfolio Value', value: formatCurrency(row.portfolioValue), color: 'var(--admin-text)' },
            { label: 'Total Trades', value: row.tradesCount.toString(), color: 'var(--admin-text)' },
            { label: 'Holdings', value: row.holdingsCount.toString(), color: 'var(--admin-text)' },
            { label: 'Gain / Loss', value: `${isUp ? '+' : ''}${gainPct.toFixed(1)}%`, color: isUp ? 'var(--admin-green)' : 'var(--admin-red)' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="text-xs mb-1" style={{ color: 'var(--admin-muted)' }}>{s.label}</div>
              <div className="font-bold text-sm" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="text-xs text-center" style={{ color: 'var(--admin-muted)', opacity: 0.5 }}>
          User ID: {row.user.id.slice(0, 8)}…
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AdminUsersClient() {
  const { stocks } = useStocks();
  const prices = useMemo(() => getPriceMap(stocks), [stocks]);
  const [search, setSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState<AdminUserRow | null>(null);
  const [resetConfirm, setResetConfirm] = useState<string | null>(null);
  const [tick, setTick] = useState(0); // force re-render after mutations

  const rows = useMemo(() => {
    const all = getAdminUserRows(prices);
    if (!search) return all;
    const q = search.toLowerCase();
    return all.filter((r) => r.user.username.toLowerCase().includes(q) || r.user.email.toLowerCase().includes(q));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices, tick, search]);

  const maxNetWorth = useMemo(() => Math.max(...rows.map((r) => r.netWorth), 1), [rows]);

  const handleResetPortfolio = useCallback((userId: string) => {
    savePortfolio({
      userId,
      cashBalance: STARTING_CASH,
      holdings: {},
      netWorthHistory: [{ timestamp: Date.now(), netWorth: STARTING_CASH, cashBalance: STARTING_CASH, portfolioValue: 0 }],
      watchlist: getPortfolio(userId)?.watchlist ?? [],
    });
    setResetConfirm(null);
    setTick((t) => t + 1);
  }, []);

  const handleToggleAdmin = useCallback((userId: string, currentIsAdmin: boolean) => {
    const users = getAllUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    saveUser({ ...user, isAdmin: !currentIsAdmin });
    setTick((t) => t + 1);
  }, []);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopbar title="User Management" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Search + stats */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6"
        >
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--admin-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--admin-text)', caretColor: 'var(--admin-cyan)',
              }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--admin-muted)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse-glow-cyan" style={{ background: 'var(--admin-cyan)' }} />
            {rows.length} user{rows.length !== 1 ? 's' : ''}
          </div>
        </motion.div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden admin-card">
          {/* Header */}
          <div className="grid px-5 py-3 text-xs font-bold tracking-wider uppercase border-b"
            style={{ gridTemplateColumns: '1fr 2fr 1fr 1fr 140px', color: 'var(--admin-muted)', borderColor: 'var(--admin-border)', background: 'rgba(255,255,255,0.02)' }}>
            <div>User</div>
            <div>Net Worth</div>
            <div>Trades</div>
            <div>Holdings</div>
            <div className="text-right">Actions</div>
          </div>

          {rows.length === 0 ? (
            <div className="py-16 text-center text-sm" style={{ color: 'var(--admin-muted)' }}>
              No users found
            </div>
          ) : (
            <motion.div className="divide-y" style={{ borderColor: 'var(--admin-border)' }}
              variants={containerVariants} initial="hidden" animate="show">
              {rows.map((row, i) => (
                <motion.div
                  key={row.user.id}
                  variants={rowVariants}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.025)' }}
                  className="grid items-center px-5 py-4 cursor-pointer"
                  style={{ gridTemplateColumns: '1fr 2fr 1fr 1fr 140px' }}
                  onClick={() => setSelectedRow(row)}
                >
                  {/* User */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <Avatar initials={row.user.avatarInitials} size="sm" />
                      {row.user.isAdmin && (
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px]"
                          style={{ background: 'var(--admin-cyan)' }}>★</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: 'var(--admin-text)' }}>
                        {row.user.username}
                      </div>
                      <div className="text-xs truncate" style={{ color: 'var(--admin-muted)' }}>{row.user.email}</div>
                    </div>
                  </div>

                  {/* Net worth bar */}
                  <div className="pr-4">
                    <NetWorthBar value={row.netWorth} max={maxNetWorth} />
                  </div>

                  {/* Trades */}
                  <div className="text-sm font-bold tabular-nums" style={{ color: row.tradesCount > 0 ? 'var(--admin-cyan)' : 'var(--admin-muted)' }}>
                    {row.tradesCount}
                  </div>

                  {/* Holdings */}
                  <div className="text-sm font-bold tabular-nums" style={{ color: row.holdingsCount > 0 ? 'var(--admin-purple)' : 'var(--admin-muted)' }}>
                    {row.holdingsCount}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    {/* Reset portfolio */}
                    {resetConfirm === row.user.id ? (
                      <div className="flex gap-1">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleResetPortfolio(row.user.id)}
                          className="px-2 py-1 rounded-lg text-xs font-bold"
                          style={{ background: 'rgba(255,68,85,0.2)', color: 'var(--admin-red)', border: '1px solid rgba(255,68,85,0.3)' }}
                        >
                          Confirm
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setResetConfirm(null)}
                          className="px-2 py-1 rounded-lg text-xs"
                          style={{ color: 'var(--admin-muted)' }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setResetConfirm(row.user.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        style={{ background: 'rgba(255,68,85,0.1)', color: 'var(--admin-red)', border: '1px solid rgba(255,68,85,0.2)' }}
                        title="Reset portfolio"
                      >
                        Reset
                      </motion.button>
                    )}

                    {/* Toggle admin */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleAdmin(row.user.id, !!row.user.isAdmin)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={row.user.isAdmin
                        ? { background: 'rgba(0,212,255,0.1)', color: 'var(--admin-cyan)', border: '1px solid rgba(0,212,255,0.2)' }
                        : { background: 'rgba(255,255,255,0.05)', color: 'var(--admin-muted)', border: '1px solid rgba(255,255,255,0.08)' }
                      }
                    >
                      {row.user.isAdmin ? '★ Admin' : 'Make Admin'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* User detail modal */}
      <AnimatePresence>
        {selectedRow && <UserDetailModal row={selectedRow} onClose={() => setSelectedRow(null)} />}
      </AnimatePresence>
    </div>
  );
}
