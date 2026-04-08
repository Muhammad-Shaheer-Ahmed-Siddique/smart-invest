'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative w-full overflow-hidden bg-[var(--bg-0)]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative w-full px-6 lg:px-10 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-sm font-semibold text-teal-600">Live Market Simulation</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold text-[var(--text-primary)] leading-[1.1] mb-6">
              START MANAGING YOUR{' '}
              <span className="text-teal-500">INVESTMENTS</span>{' '}
              WITH SMARTINVEST
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-xl leading-relaxed">
              Unlock smarter investment management. Practice stock trading with real-time simulated markets — zero risk, maximum learning.
            </p>

            <ul className="space-y-3 mb-10">
              {['Track Your Portfolio in Real-Time', 'Compete on Global Leaderboards', 'Learn with Educational Resources'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[var(--text-primary)]">
                  <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                  <span className="text-base font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={isAuthenticated ? '/dashboard' : '/signup'}
                className="inline-flex items-center justify-center gap-2 px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl hover:shadow-2xl hover:shadow-teal-500/20 transition-all hover:-translate-y-1"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Start Trading Free'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#market-overview"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 text-base font-semibold text-[var(--text-secondary)] border-2 border-[var(--border-color)] rounded-xl hover:bg-[var(--bg-2)] transition-all"
              >
                View Markets
              </a>
            </div>
          </motion.div>

          {/* Right: Dashboard preview (always dark mockup) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              <div className="bg-[#0a0e1a] rounded-3xl shadow-2xl shadow-black/30 border border-white/10 overflow-hidden w-[480px]">
                <div className="p-1.5">
                  <div className="flex items-center gap-1.5 px-3 py-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="text-[10px] text-gray-500 ml-2 font-mono">smartinvest.app/dashboard</span>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <div className="bg-white/5 rounded-lg p-2 mb-3 flex items-center gap-4 overflow-hidden">
                    <span className="text-[9px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-400/10">LIVE</span>
                    <span className="text-[9px] text-gray-400">AAPL <span className="text-emerald-400">+2.4%</span></span>
                    <span className="text-[9px] text-gray-400">MSFT <span className="text-emerald-400">+1.8%</span></span>
                    <span className="text-[9px] text-gray-400">TSLA <span className="text-red-400">-0.5%</span></span>
                    <span className="text-[9px] text-gray-400">NVDA <span className="text-emerald-400">+3.1%</span></span>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl border border-white/10 p-4 mb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-400/10 flex items-center justify-center text-[11px] font-bold text-emerald-400">NV</div>
                      <div><div className="text-sm font-bold text-white">NVDA</div><div className="text-[10px] text-gray-500">NVIDIA Corp.</div></div>
                      <div className="ml-auto text-right"><div className="text-sm font-bold text-white">$605.88</div><div className="text-[10px] text-emerald-400">+23.65%</div></div>
                    </div>
                    <svg className="w-full h-20" viewBox="0 0 400 80" preserveAspectRatio="none">
                      <defs><linearGradient id="heroGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00ff88" stopOpacity="0.25" /><stop offset="100%" stopColor="#00ff88" stopOpacity="0" /></linearGradient></defs>
                      <path d="M0,65 C20,60 50,55 80,40 C110,25 140,50 180,35 C220,20 260,15 300,25 C340,35 370,18 400,10" fill="none" stroke="#00ff88" strokeWidth="2" />
                      <path d="M0,65 C20,60 50,55 80,40 C110,25 140,50 180,35 C220,20 260,15 300,25 C340,35 370,18 400,10 L400,80 L0,80 Z" fill="url(#heroGrad2)" />
                    </svg>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[{ l: 'Net Worth', v: '$98,576' }, { l: 'Cash', v: '$87,183' }, { l: 'Invested', v: '$11,393' }, { l: 'P&L', v: '-$1,424' }].map((s) => (
                      <div key={s.l} className="bg-white/[0.03] rounded-lg border border-white/5 p-2.5">
                        <div className="text-[8px] uppercase tracking-wider text-gray-500">{s.l}</div>
                        <div className="text-[11px] font-bold text-white mt-0.5">{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-8 bg-[var(--bg-0)] rounded-xl shadow-2xl border border-[var(--border-color)] px-5 py-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">Portfolio Up</div>
                  <div className="text-xs text-emerald-500 font-semibold">+12.4% this week</div>
                </div>
              </div>

              <div className="absolute -top-4 -right-6 bg-[var(--bg-0)] rounded-xl shadow-2xl border border-[var(--border-color)] px-4 py-3">
                <div className="text-xs font-bold text-[var(--text-primary)]">20+ Stocks</div>
                <div className="text-[10px] text-[var(--text-muted)]">Live Simulation</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-wrap items-center gap-x-12 gap-y-4 mt-16 pt-10 border-t border-[var(--border-color)]">
          {[{ n: '20+', l: 'Live Stocks' }, { n: '2s', l: 'Price Updates' }, { n: '$100K', l: 'Starting Cash' }, { n: '8', l: 'Sectors' }, { n: '24/7', l: 'Market Access' }].map((s) => (
            <div key={s.l}>
              <div className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">{s.n}</div>
              <div className="text-sm text-[var(--text-muted)]">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
