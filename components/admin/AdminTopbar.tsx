'use client';

import { useAuth } from '@/hooks/useAuth';
import { useStocks } from '@/hooks/useStocks';
import { Avatar } from '@/components/ui';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function AdminTopbar({ title }: { title?: string }) {
  const { user, logout } = useAuth();
  const { isSimulating, lastTickAt } = useStocks();

  function handleLogout() {
    logout();
    window.location.href = '/';
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b shrink-0"
      style={{ background: 'rgba(7,11,20,0.8)', borderColor: 'var(--admin-border)', backdropFilter: 'blur(12px)' }}>

      <div className="flex items-center gap-4">
        {/* Back to Dashboard */}
        <Link href="/dashboard">
          <motion.div
            whileHover={{ x: -2 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors hover:bg-white/5"
            style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-cyan)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Dashboard
          </motion.div>
        </Link>
        <h1 className="text-lg font-bold" style={{ color: 'var(--admin-text)' }}>
          {title ?? 'Admin Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Market status indicator */}
        <motion.div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium"
          style={{
            background: isSimulating ? 'rgba(0,255,136,0.08)' : 'rgba(255,68,85,0.08)',
            borderColor: isSimulating ? 'rgba(0,255,136,0.25)' : 'rgba(255,68,85,0.25)',
            color: isSimulating ? 'var(--admin-green)' : 'var(--admin-red)',
          }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: isSimulating ? 'var(--admin-green)' : 'var(--admin-red)' }}
            animate={{ opacity: isSimulating ? [1, 0.3, 1] : 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {isSimulating ? 'Market Live' : 'Market Paused'}
        </motion.div>

        {/* Last tick time */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs" style={{ color: 'var(--admin-muted)' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {new Date(lastTickAt).toLocaleTimeString()}
        </div>

        {/* User */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar initials={user.avatarInitials} size="sm" />
              <div className="hidden sm:block text-xs" style={{ color: 'var(--admin-subtext)' }}>
                <div className="font-medium" style={{ color: 'var(--admin-text)' }}>{user.username}</div>
                <div className="gradient-text-cyan font-semibold">Administrator</div>
              </div>
            </div>
            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors hover:bg-red-500/10"
              style={{ borderColor: 'rgba(255,68,85,0.3)', color: 'var(--admin-red)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </motion.button>
          </div>
        )}
      </div>
    </header>
  );
}
