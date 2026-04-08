'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllUsers, getTransactions } from '@/lib/storage';
import { formatCurrency, formatRelativeTime } from '@/lib/formatters';

export function ActivityFeed() {
  const items = useMemo(() => {
    if (typeof window === 'undefined') return [];
    const users = getAllUsers();
    const all = users.flatMap((u) =>
      getTransactions(u.id).map((t) => ({ ...t, username: u.username, avatarInitials: u.avatarInitials }))
    );
    return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, 12);
  }, []);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2">
        <div className="text-3xl opacity-20">📊</div>
        <p className="text-sm" style={{ color: 'var(--admin-muted)' }}>No trades yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 overflow-y-auto max-h-72 pr-1">
      <AnimatePresence initial={false}>
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'rgba(0,212,255,0.15)', color: 'var(--admin-cyan)' }}>
              {item.avatarInitials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold" style={{ color: 'var(--admin-text)' }}>{item.username}</span>
                <span
                  className="px-1.5 py-0.5 rounded text-xs font-bold"
                  style={{
                    background: item.type === 'BUY' ? 'rgba(0,255,136,0.15)' : 'rgba(255,68,85,0.15)',
                    color: item.type === 'BUY' ? 'var(--admin-green)' : 'var(--admin-red)',
                  }}
                >
                  {item.type}
                </span>
                <span style={{ color: 'var(--admin-subtext)' }}>{item.shares} × {item.ticker}</span>
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--admin-muted)' }}>
                {formatRelativeTime(item.timestamp)}
              </div>
            </div>

            {/* Value */}
            <div className="text-xs font-semibold tabular-nums"
              style={{ color: item.type === 'BUY' ? 'var(--admin-red)' : 'var(--admin-green)' }}>
              {item.type === 'BUY' ? '-' : '+'}{formatCurrency(item.totalValue)}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
