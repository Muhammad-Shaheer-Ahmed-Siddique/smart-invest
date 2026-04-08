# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Scope & Problem Statement

SmartInvest is a **risk-free stock market simulator** designed for beginners and students who want to learn investing without losing real money. In Pakistan and similar markets, new investors often lose capital because they jump into live trading without understanding market mechanics — SmartInvest solves this by providing a realistic paper trading environment.

### Core Features

- **Real-Time Price Simulation** — Stocks move every 2 seconds using Geometric Brownian Motion (the same math behind real market models), giving users a realistic feel for price volatility without needing live API feeds.
- **Paper Trading** — Users start with virtual cash and can buy/sell 25+ stocks across 8 sectors. All trades, holdings, and P&L are tracked per user.
- **Portfolio Analytics** — Net worth history chart, allocation pie chart, per-holding gain/loss tracking, and portfolio summary cards help users understand diversification and performance.
- **Live Dashboard** — Neon-themed dashboard with market overview, top movers, watchlist, live stock carousel, and net worth stats — modeled after platforms like Sarmaaya.pk.
- **Leaderboard** — Ranked by portfolio performance so users can compete and learn from top performers.
- **Learning Hub** — Markdown-based educational articles covering investing fundamentals, technical analysis, and risk management.
- **Admin Panel** — KPI dashboard, user management, market analytics, and activity feed for platform oversight.
- **Auth System** — Signup/login with session persistence. Route guards (`AuthGuard`, `AdminGuard`) protect app and admin routes.

### What Makes It Different

- **Zero backend dependency** — Entire app runs client-side with localStorage. No database, no API keys, no hosting costs. Anyone can clone and run it instantly.
- **Mathematically modeled prices** — Not random numbers; uses GBM with configurable drift and volatility per stock, producing realistic OHLCV candle data.
- **Sarmaaya-inspired UI** — Dark neon aesthetic familiar to Pakistani market users, with responsive mobile support.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — ESLint (Next.js core web vitals + TypeScript)

No test runner is configured.

## Architecture

**SmartInvest** is a client-side paper trading stock simulator. There is no backend — all data lives in browser `localStorage` with `si_` prefixed keys.

### Stack

- Next.js 16 (App Router), React 19, TypeScript 5
- Tailwind CSS 4 via `@tailwindcss/postcss` (PostCSS plugin, not classic config file)
- Framer Motion for animations, Recharts for charts
- Path alias: `@/*` maps to project root

### Route Groups

- `(app)/` — Main app (dashboard, market, portfolio, leaderboard, learn, transactions). Wrapped by `AuthGuard`.
- `(auth)/` — Login/signup pages. Centered layout.
- `admin/` — Admin panel with dedicated neon/cyan theme. Wrapped by `AdminGuard`.
- Root `page.tsx` — Landing page, auto-redirects authenticated users to dashboard.

### State Management (React Context)

Three providers composed in `contexts/Providers.tsx`:

- **AuthContext** — Login, signup, logout, session persistence via localStorage.
- **StockContext** — Real-time price simulation on a 2-second tick interval using Geometric Brownian Motion (`lib/stockEngine.ts`). Provides live OHLCV data for 25+ stocks across 8 sectors.
- **PortfolioContext** — Holdings, buy/sell execution, net worth history snapshots.

Access via hooks: `useAuth()`, `useStocks()`, `usePortfolio()`.

### Key Directories

- `data/` — Seed data: stock definitions (`stocks.ts`), leaderboard entries, learn articles.
- `lib/` — Pure utility modules: stock engine, auth helpers, formatters, portfolio math, localStorage wrapper, admin aggregations.
- `types/` — Central type definitions in `types/index.ts`.
- `components/` — Organized by feature domain: `ui/`, `layout/`, `dashboard/`, `market/`, `portfolio/`, `admin/`, `auth/`, `landing/`, `leaderboard/`, `learn/`, `transactions/`.

### Styling

Tailwind 4 with CSS custom properties for theming (light/dark mode toggle). Design tokens defined as CSS variables in `app/globals.css`. The admin panel uses a separate `--admin-*` variable set. Class merging uses `clsx` + `tailwind-merge` via `lib/cn.ts`.

### Dynamic Routes

- `/market/[ticker]` — Individual stock detail page
- `/learn/[slug]` — Individual article page
