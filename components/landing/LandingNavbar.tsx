'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function LandingNavbar() {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('si_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored ? stored === 'dark' : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('si_theme', next ? 'dark' : 'light');
  }

  return (
    <>
      <div className="w-full h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400" />

      <header className="sticky top-0 z-50 w-full bg-[var(--bg-0)] border-b border-[var(--border-color)] backdrop-blur-xl" style={{ background: `color-mix(in srgb, var(--bg-0) 90%, transparent)` }}>
        <div className="w-full px-6 lg:px-10">
          <div className="flex items-center justify-between h-[72px]">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="font-bold text-2xl text-[var(--text-primary)]">SmartInvest</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: 'Markets', href: '#market-overview' },
                { label: 'Features', href: '#features' },
                { label: 'Tools', href: '#tools' },
                { label: 'Learn', href: '/learn' },
              ].map((item) =>
                item.href.startsWith('#') ? (
                  <a key={item.label} href={item.href} className="px-5 py-2.5 text-[15px] font-medium text-[var(--text-secondary)] hover:text-teal-600 rounded-lg hover:bg-[var(--bg-2)] transition-colors">
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.label} href={item.href} className="px-5 py-2.5 text-[15px] font-medium text-[var(--text-secondary)] hover:text-teal-600 rounded-lg hover:bg-[var(--bg-2)] transition-colors">
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-2)] transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.485-8.485h-1M4.515 12H3.5m14.85 5.364l-.707-.707M7.05 7.05l-.707-.707M19.364 7.05l-.707.707M7.05 16.95l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <button className="hidden md:flex w-10 h-10 rounded-xl items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-2)] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {isAuthenticated ? (
                <Link href="/dashboard" className="hidden md:inline-flex px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all">
                  Dashboard
                </Link>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/signup" className="px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)] border border-[var(--border-color)] rounded-xl hover:bg-[var(--bg-2)] transition-all">
                    Sign Up
                  </Link>
                  <Link href="/login" className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all">
                    Log In
                  </Link>
                </div>
              )}

              <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
                <svg className="w-6 h-6 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="lg:hidden border-t border-[var(--border-color)] py-4 space-y-1">
              <a href="#market-overview" className="block px-4 py-3 text-[15px] font-medium text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-2)]">Markets</a>
              <a href="#features" className="block px-4 py-3 text-[15px] font-medium text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-2)]">Features</a>
              <a href="#tools" className="block px-4 py-3 text-[15px] font-medium text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-2)]">Tools</a>
              <Link href="/learn" className="block px-4 py-3 text-[15px] font-medium text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-2)]">Learn</Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
