import type { Holding, Portfolio } from '@/types';

export function calculateHoldingValue(holding: Holding, currentPrice: number): number {
  return holding.shares * currentPrice;
}

export function calculateUnrealizedPnL(
  holding: Holding,
  currentPrice: number
): { absolute: number; percent: number } {
  const currentValue = holding.shares * currentPrice;
  const absolute = currentValue - holding.totalInvested;
  const percent = holding.totalInvested !== 0 ? absolute / holding.totalInvested : 0;
  return { absolute, percent };
}

export function calculatePortfolioValue(
  holdings: Record<string, Holding>,
  prices: Record<string, number>
): number {
  return Object.values(holdings).reduce((total, holding) => {
    const price = prices[holding.ticker] ?? holding.avgCostBasis;
    return total + holding.shares * price;
  }, 0);
}

export function calculateNetWorth(
  portfolio: Portfolio,
  prices: Record<string, number>
): number {
  return portfolio.cashBalance + calculatePortfolioValue(portfolio.holdings, prices);
}

export function calculateAllocation(
  holdings: Record<string, Holding>,
  prices: Record<string, number>
): Array<{ ticker: string; percent: number; value: number }> {
  const totalValue = calculatePortfolioValue(holdings, prices);
  if (totalValue === 0) return [];

  return Object.values(holdings).map((holding) => {
    const price = prices[holding.ticker] ?? holding.avgCostBasis;
    const value = holding.shares * price;
    return { ticker: holding.ticker, percent: value / totalValue, value };
  });
}

export function validateBuyOrder(
  shares: number,
  pricePerShare: number,
  cashBalance: number
): string | null {
  if (!shares || shares <= 0) return 'Enter a valid number of shares';
  if (!Number.isFinite(shares)) return 'Invalid share amount';
  const totalCost = shares * pricePerShare;
  if (totalCost > cashBalance) {
    return `Insufficient funds. Need $${totalCost.toFixed(2)}, have $${cashBalance.toFixed(2)}`;
  }
  return null;
}

export function validateSellOrder(
  shares: number,
  holding: Holding | undefined
): string | null {
  if (!shares || shares <= 0) return 'Enter a valid number of shares';
  if (!holding || holding.shares === 0) return 'You do not own any shares of this stock';
  if (shares > holding.shares) {
    return `Cannot sell ${shares} shares — you only own ${holding.shares}`;
  }
  return null;
}

export function computeNewAvgCost(
  existing: Holding,
  newShares: number,
  newPrice: number
): number {
  const totalShares = existing.shares + newShares;
  const totalCost = existing.totalInvested + newShares * newPrice;
  return totalShares > 0 ? totalCost / totalShares : newPrice;
}
