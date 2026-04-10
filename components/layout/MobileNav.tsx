'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/market', label: 'Market' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/learn', label: 'Learn' },
  { href: '/tools', label: 'Tools' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--bg-0)] border-r border-[var(--border-color)] flex flex-col">
            <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="font-bold text-[var(--text-primary)]">SmartInvest</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-2)]'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
