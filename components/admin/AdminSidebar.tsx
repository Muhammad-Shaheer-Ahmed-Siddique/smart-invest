'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    exact: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-3a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
      </svg>
    ),
  },
  {
    href: '/admin/users',
    label: 'Users',
    exact: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: '/admin/market',
    label: 'Market',
    exact: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    exact: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-full border-r admin-card"
      style={{ background: 'rgba(7,11,20,0.9)', borderColor: 'var(--admin-border)' }}>

      {/* Logo */}
      <div className="px-5 py-6 border-b" style={{ borderColor: 'var(--admin-border)' }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-lg animate-pulse-glow-cyan"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }} />
            <div className="relative w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
              <svg className="w-4.5 h-4.5 text-white w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div>
            <div className="font-bold text-base" style={{ color: 'var(--admin-text)' }}>SmartInvest</div>
            <div className="text-xs font-medium gradient-text-cyan">Admin Console</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer overflow-hidden',
                  isActive ? '' : 'hover:bg-white/5'
                )}
                style={isActive ? {
                  background: 'rgba(0,212,255,0.1)',
                  color: 'var(--admin-cyan)',
                  boxShadow: 'inset 0 0 20px rgba(0,212,255,0.08)',
                } : { color: 'var(--admin-muted)' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="admin-nav-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                    style={{ background: 'var(--admin-cyan)', boxShadow: '0 0 8px var(--admin-cyan)' }}
                  />
                )}
                <span style={isActive ? { color: 'var(--admin-cyan)' } : {}}>{item.icon}</span>
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Back to app */}
      <div className="px-4 pb-5 pt-3 border-t" style={{ borderColor: 'var(--admin-border)' }}>
        <Link href="/dashboard">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors hover:bg-white/5"
            style={{ color: 'var(--admin-muted)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to App
          </motion.div>
        </Link>
        <div className="mt-2 text-center text-xs" style={{ color: 'var(--admin-muted)', opacity: 0.5 }}>
          v1.0 · Admin Access Only
        </div>
      </div>
    </aside>
  );
}
