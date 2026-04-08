import type { Stock, PricePoint } from '@/types';
import { MAX_PRICE_HISTORY } from '@/lib/constants';

// Box-Muller transform: produces N(0,1) sample from two uniform random variables
export function generateNormal(mean = 0, stddev = 1): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + stddev * z;
}

// Geometric Brownian Motion tick for a single stock
export function simulateTick(stock: Stock): Stock {
  const { currentPrice, volatility, trend, initialPrice } = stock;

  const epsilon = generateNormal(0, 1);
  const dt = 1;
  const dS = currentPrice * (trend * dt + volatility * epsilon * Math.sqrt(dt));
  let newPrice = currentPrice + dS;

  // Clamp price within sensible bounds
  newPrice = Math.max(newPrice, initialPrice * 0.1);
  newPrice = Math.min(newPrice, initialPrice * 10);
  newPrice = Math.round(newPrice * 100) / 100;

  // Generate synthetic OHLCV
  const open = currentPrice;
  const close = newPrice;
  const microHigh = Math.max(open, close) * (1 + Math.random() * 0.003);
  const microLow = Math.min(open, close) * (1 - Math.random() * 0.003);
  const volume = Math.floor(Math.random() * 500_000 + 100_000);

  const newPoint: PricePoint = {
    timestamp: Date.now(),
    price: newPrice,
    open,
    high: microHigh,
    low: microLow,
    close,
    volume,
  };

  const history = [...stock.priceHistory, newPoint];
  if (history.length > MAX_PRICE_HISTORY) history.shift();

  return {
    ...stock,
    currentPrice: newPrice,
    previousClose: stock.previousClose,
    priceHistory: history,
    volume: stock.volume + volume,
  };
}

// Tick all stocks at once
export function simulateAllTicks(stocks: Record<string, Stock>): Record<string, Stock> {
  const result: Record<string, Stock> = {};
  for (const ticker in stocks) {
    result[ticker] = simulateTick(stocks[ticker]);
  }
  return result;
}

// Get price map from stocks record
export function getPriceMap(stocks: Record<string, Stock>): Record<string, number> {
  const map: Record<string, number> = {};
  for (const ticker in stocks) {
    map[ticker] = stocks[ticker].currentPrice;
  }
  return map;
}
