'use client';

import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="w-full bg-[var(--bg-0)] border-t border-[var(--border-color)]">
      {/* CTA */}
      <div className="w-full bg-gradient-to-r from-teal-500 to-emerald-600">
        <div className="w-full px-6 lg:px-10 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">Start Your Investment Journey Today</h2>
          <p className="text-teal-50 text-lg mb-8 max-w-2xl mx-auto">Practice trading with $100,000 virtual cash. No risk, all the learning.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-teal-600 font-bold text-base rounded-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            Create Free Account
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </div>

      {/* Links */}
      <div className="w-full px-6 lg:px-10 py-16 md:py-20 bg-[var(--bg-1)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <span className="font-bold text-xl text-[var(--text-primary)]">SmartInvest</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-5">The best platform to learn stock trading without risking real money.</p>
            <div className="flex items-center gap-3">
              {['facebook', 'twitter', 'linkedin', 'youtube'].map((s) => (
                <div key={s} className="w-10 h-10 rounded-xl bg-[var(--bg-2)] border border-[var(--border-color)] flex items-center justify-center hover:border-teal-500/30 transition-colors cursor-pointer">
                  <svg className="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /></svg>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-5 uppercase tracking-wider text-[var(--text-secondary)]">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/login" className="text-sm text-[var(--text-muted)] hover:text-teal-500 transition-colors">Market Overview</Link></li>
              <li><Link href="/login" className="text-sm text-[var(--text-muted)] hover:text-teal-500 transition-colors">Portfolio Tracker</Link></li>
              <li><Link href="/login" className="text-sm text-[var(--text-muted)] hover:text-teal-500 transition-colors">Leaderboard</Link></li>
              <li><Link href="/learn" className="text-sm text-[var(--text-muted)] hover:text-teal-500 transition-colors">Learning Hub</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-5 uppercase tracking-wider text-[var(--text-secondary)]">Company</h4>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
              Built by <span className="font-semibold text-[var(--text-primary)]">S4AI Limited</span> — crafting intelligent financial tools and AI-powered solutions.
            </p>
            <ul className="space-y-3">
              <li><Link href="/terms" className="text-sm text-[var(--text-muted)] hover:text-teal-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-[var(--text-muted)] hover:text-teal-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-5 uppercase tracking-wider text-[var(--text-secondary)]">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                shaheershafique567@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                +92 312 3456789
              </li>
              <li className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                S4AI Limited, Islamabad
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-[var(--border-color)] bg-[var(--bg-1)]">
        <div className="w-full px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">&copy; 2026 S4AI Limited. All rights reserved.</p>
          <p className="text-xs text-[var(--text-muted)]">Simulated data for educational purposes only. Not financial advice.</p>
        </div>
      </div>
    </footer>
  );
}
