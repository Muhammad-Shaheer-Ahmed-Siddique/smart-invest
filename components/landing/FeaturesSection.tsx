'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const FEATURES = [
  { icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>, title: 'Real-Time Market Simulation', desc: 'Live stock prices updated every 2 seconds using advanced Geometric Brownian Motion simulation.', color: '#0d9488' },
  { icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, title: 'Portfolio Management', desc: 'Track your holdings, cost basis, P&L, and portfolio allocation with beautiful visualizations.', color: '#7c3aed' },
  { icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, title: 'Leaderboard & Rankings', desc: 'Compete with other traders and climb the leaderboard to prove your investing skills.', color: '#ea580c' },
  { icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, title: 'Learning Hub', desc: 'Educational articles covering fundamentals, technical analysis, risk management, and strategies.', color: '#2563eb' },
  { icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, title: 'Admin Dashboard', desc: 'Powerful admin panel with analytics, market event triggers, and user management.', color: '#0891b2' },
  { icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, title: 'Market Events', desc: 'Experience bull runs, bear markets, and black swan events that impact all stock prices.', color: '#dc2626' },
];

const TOOLS = [
  { name: 'ROI Calculator', href: '/tools/roi-calculator' },
  { name: 'Portfolio Tracker', href: '/portfolio' },
  { name: 'Net Worth Chart', href: '/dashboard' },
  { name: 'Sector Heatmap', href: '/tools/sector-heatmap' },
  { name: 'Stock Screener', href: '/tools/stock-screener' },
  { name: 'Price Alerts', href: '/tools/price-alerts' },
  { name: 'Transaction History', href: '/transactions' },
  { name: 'Allocation Chart', href: '/portfolio' },
  { name: 'Market Movers', href: '/dashboard' },
  { name: 'Watchlist Manager', href: '/dashboard' },
  { name: 'P&L Analyzer', href: '/tools/pnl-analyzer' },
  { name: 'Risk Assessment', href: '/tools/risk-assessment' },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } };

export function FeaturesSection() {
  return (
    <>
      <section id="features" className="w-full py-20 md:py-28 bg-[var(--bg-1)]">
        <div className="w-full px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] mb-4">
              Everything You Need to <span className="text-teal-500">Learn Trading</span>
            </h2>
            <p className="text-[var(--text-muted)] text-lg md:text-xl max-w-3xl mx-auto">Comprehensive tools and features designed to help you master the stock market</p>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={itemVariants} className="bg-[var(--bg-0)] rounded-2xl border border-[var(--border-color)] p-7 hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110" style={{ background: `${f.color}15`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="tools" className="w-full py-20 md:py-28 bg-[var(--bg-0)]">
        <div className="w-full px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] mb-4">Popular Tools</h2>
            <p className="text-[var(--text-muted)] text-lg md:text-xl max-w-3xl mx-auto">All the tools you need to analyze and manage your investments</p>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {TOOLS.map((tool) => (
              <motion.div key={tool.name} variants={itemVariants}>
                <Link href={tool.href} className="block bg-[var(--bg-1)] rounded-xl border border-[var(--border-color)] p-5 text-center hover:border-teal-500/30 transition-all group hover:-translate-y-1">
                  <div className="w-11 h-11 rounded-xl bg-[var(--bg-0)] border border-[var(--border-color)] flex items-center justify-center mx-auto mb-3 group-hover:border-teal-500/30 transition-colors">
                    <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-sm font-semibold text-[var(--text-secondary)] group-hover:text-teal-500 transition-colors">{tool.name}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
