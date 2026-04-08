import type { AdminUserRow, AdminStats } from '@/types';
import { getAllUsers, getPortfolio, getTransactions } from '@/lib/storage';
import { calculateNetWorth, calculatePortfolioValue } from '@/lib/portfolio';

export function getAdminUserRows(prices: Record<string, number>): AdminUserRow[] {
  const users = getAllUsers();
  return users.map((user) => {
    const portfolio = getPortfolio(user.id);
    const transactions = getTransactions(user.id);
    const netWorth = portfolio ? calculateNetWorth(portfolio, prices) : user.startingCash;
    const portfolioValue = portfolio
      ? calculatePortfolioValue(portfolio.holdings, prices)
      : 0;
    return {
      user,
      netWorth,
      tradesCount: transactions.length,
      holdingsCount: portfolio ? Object.keys(portfolio.holdings).length : 0,
      cashBalance: portfolio?.cashBalance ?? user.startingCash,
      portfolioValue,
    };
  });
}

export function getAdminStats(prices: Record<string, number>): AdminStats {
  const rows = getAdminUserRows(prices);
  const allTxns = rows.flatMap((r) => getTransactions(r.user.id));

  const totalVolume = allTxns.reduce((s, t) => s + t.totalValue, 0);
  const avgNetWorth = rows.length > 0
    ? rows.reduce((s, r) => s + r.netWorth, 0) / rows.length
    : 0;

  const tickerCounts: Record<string, number> = {};
  for (const t of allTxns) {
    tickerCounts[t.ticker] = (tickerCounts[t.ticker] ?? 0) + 1;
  }
  const topTrader = rows.sort((a, b) => b.netWorth - a.netWorth)[0]?.user.username ?? 'N/A';
  const activeHoldings = rows.reduce((s, r) => s + r.holdingsCount, 0);

  return {
    totalUsers: rows.length,
    totalTrades: allTxns.length,
    totalVolume,
    avgNetWorth,
    topTrader,
    activeHoldings,
  };
}

export function getMostTradedStocks(limit = 8): { ticker: string; count: number; volume: number }[] {
  const users = getAllUsers();
  const map: Record<string, { count: number; volume: number }> = {};
  for (const user of users) {
    const txns = getTransactions(user.id);
    for (const t of txns) {
      if (!map[t.ticker]) map[t.ticker] = { count: 0, volume: 0 };
      map[t.ticker].count += 1;
      map[t.ticker].volume += t.totalValue;
    }
  }
  return Object.entries(map)
    .map(([ticker, data]) => ({ ticker, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getVolumeByDay(days = 7): { day: string; volume: number; trades: number }[] {
  const users = getAllUsers();
  const allTxns = users.flatMap((u) => getTransactions(u.id));
  const map: Record<string, { volume: number; trades: number }> = {};
  const now = Date.now();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * 86_400_000);
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    map[key] = { volume: 0, trades: 0 };
  }
  for (const t of allTxns) {
    const key = new Date(t.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (map[key]) {
      map[key].volume += t.totalValue;
      map[key].trades += 1;
    }
  }
  return Object.entries(map).map(([day, data]) => ({ day, ...data }));
}

export function getSectorVolume(): { sector: string; volume: number }[] {
  const users = getAllUsers();
  const allTxns = users.flatMap((u) => getTransactions(u.id));
  // Inline static sector map for transactions
  const sectorMap: Record<string, string> = {
    AAPL: 'Technology', MSFT: 'Technology', GOOGL: 'Technology', NVDA: 'Technology', META: 'Technology',
    JPM: 'Finance', BAC: 'Finance', GS: 'Finance',
    JNJ: 'Healthcare', PFE: 'Healthcare', UNH: 'Healthcare',
    XOM: 'Energy', CVX: 'Energy',
    AMZN: 'Consumer', TSLA: 'Consumer', NKE: 'Consumer',
    CAT: 'Industrial', BA: 'Industrial',
    NEE: 'Utilities',
    LIN: 'Materials',
  };
  const result: Record<string, number> = {};
  for (const t of allTxns) {
    const sector = sectorMap[t.ticker] ?? 'Other';
    result[sector] = (result[sector] ?? 0) + t.totalValue;
  }
  return Object.entries(result).map(([sector, volume]) => ({ sector, volume }));
}
