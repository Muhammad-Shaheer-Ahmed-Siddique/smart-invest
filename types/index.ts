// ===========================
// USER & AUTH
// ===========================

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatarInitials: string;
  createdAt: number;
  startingCash: number;
  isAdmin?: boolean;
}

// ===========================
// ADMIN
// ===========================

export interface AdminStats {
  totalUsers: number;
  totalTrades: number;
  totalVolume: number;
  avgNetWorth: number;
  topTrader: string;
  activeHoldings: number;
}

export type MarketEventType = 'bull_run' | 'bear_market' | 'black_swan' | 'recovery' | 'normal';

export interface AdminUserRow {
  user: User;
  netWorth: number;
  tradesCount: number;
  holdingsCount: number;
  cashBalance: number;
  portfolioValue: number;
}

export interface AuthSession {
  userId: string;
  token: string;
  expiresAt: number;
}

// ===========================
// MARKET DATA
// ===========================

export type StockSector =
  | 'Technology'
  | 'Finance'
  | 'Healthcare'
  | 'Energy'
  | 'Consumer'
  | 'Industrial'
  | 'Utilities'
  | 'Materials';

export interface PricePoint {
  timestamp: number;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Stock {
  ticker: string;
  name: string;
  sector: StockSector;
  currentPrice: number;
  openPrice: number;
  previousClose: number;
  priceHistory: PricePoint[];
  volatility: number;
  trend: number;
  volume: number;
  marketCap: string;
  description: string;
  initialPrice: number;
}

// ===========================
// PORTFOLIO
// ===========================

export interface Holding {
  ticker: string;
  shares: number;
  avgCostBasis: number;
  totalInvested: number;
}

export interface NetWorthSnapshot {
  timestamp: number;
  netWorth: number;
  cashBalance: number;
  portfolioValue: number;
}

export interface Portfolio {
  userId: string;
  cashBalance: number;
  holdings: Record<string, Holding>;
  netWorthHistory: NetWorthSnapshot[];
  watchlist: string[];
}

// ===========================
// TRANSACTIONS
// ===========================

export type TransactionType = 'BUY' | 'SELL';

export interface Transaction {
  id: string;
  userId: string;
  ticker: string;
  type: TransactionType;
  shares: number;
  pricePerShare: number;
  totalValue: number;
  fee: number;
  timestamp: number;
  balanceAfter: number;
}

// ===========================
// LEADERBOARD
// ===========================

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarInitials: string;
  netWorth: number;
  change24h: number;
  rank: number;
  isCurrentUser: boolean;
}

// ===========================
// LEARNING HUB
// ===========================

export type ArticleCategory =
  | 'Fundamentals'
  | 'Technical Analysis'
  | 'Risk Management'
  | 'Strategy'
  | 'Glossary';

export interface Article {
  slug: string;
  title: string;
  category: ArticleCategory;
  readingTimeMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  content: string;
  publishedAt: string;
  tags: string[];
}

// ===========================
// APP STATE
// ===========================

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
}

// ===========================
// FORM TYPES
// ===========================

export interface OrderFormState {
  ticker: string;
  type: TransactionType;
  shares: number;
  estimatedCost: number;
  error: string | null;
}

export interface AuthFormState {
  error: string | null;
  isLoading: boolean;
}
