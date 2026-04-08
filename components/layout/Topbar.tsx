'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui';
import { MobileNav } from './MobileNav';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('si_theme');
    const dark = stored ? stored === 'dark' : true;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('si_theme', next ? 'dark' : 'light');
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <header className="h-20 flex items-center justify-between px-5 md:px-8 shrink-0 bg-[var(--bg-0)] border-b border-[var(--border-color)]">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #00d4ff, #a855f7)' }}>
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <span className="font-bold text-[var(--text-primary)]">SmartInvest</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Home Website button */}
        <Link
          href="/?home=1"
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-teal-500/20"
          style={{ background: 'linear-gradient(135deg, #00d4ff, #a855f7)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </Link>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all bg-[var(--bg-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]"
        >
          {isDark ? (
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.485-8.485h-1M4.515 12H3.5m14.85 5.364l-.707-.707M7.05 7.05l-.707-.707M19.364 7.05l-.707.707M7.05 16.95l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
          {isDark ? 'Light' : 'Dark'}
        </button>

        {user?.isAdmin && (
          <a
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors bg-[rgba(0,212,255,0.1)] text-[#00d4ff] border border-[rgba(0,212,255,0.2)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Admin
          </a>
        )}

        {/* Sign Up / Log In when logged out */}
        {!user && (
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-2)] transition-all"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-teal-500/20"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #a855f7)' }}
            >
              Log In
            </Link>
          </div>
        )}

        {/* Profile dropdown */}
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-all hover:bg-[var(--bg-2)]"
            >
              <Avatar initials={user.avatarInitials} size="md" />
              <span className="hidden sm:block text-sm font-semibold text-[var(--text-primary)] max-w-[120px] truncate">
                {user.username}
              </span>
              <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl z-50 py-2 overflow-hidden bg-[var(--bg-0)] border border-[var(--border-color)] shadow-xl">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-color)]">
                  <Avatar initials={user.avatarInitials} size="lg" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">{user.username}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                  </div>
                </div>

                <div className="px-5 py-3 border-b border-[var(--border-color)]">
                  <span className="text-xs font-bold text-[#00d4ff]">
                    {user.isAdmin ? 'Admin' : 'Free Plan'}
                  </span>
                </div>

                <div className="py-1">
                  <button className="w-full flex items-center gap-3 px-5 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-2)] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-5 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-2)] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Terms & Conditions
                  </button>
                </div>

                <div className="border-t border-[var(--border-color)]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-danger-500 hover:bg-danger-500/5 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
