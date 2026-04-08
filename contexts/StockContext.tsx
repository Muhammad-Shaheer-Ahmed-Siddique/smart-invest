'use client';

import { createContext, useReducer, useEffect, useCallback } from 'react';
import type { Stock, MarketEventType } from '@/types';
import { SEED_STOCKS } from '@/data/stocks';
import { simulateAllTicks } from '@/lib/stockEngine';
import { TICK_INTERVAL_MS } from '@/lib/constants';

// ===========================
// STATE
// ===========================

interface StockState {
  stocks: Record<string, Stock>;
  lastTickAt: number;
  isSimulating: boolean;
  marketEvent: MarketEventType;
}

type StockAction =
  | { type: 'INIT_STOCKS' }
  | { type: 'TICK' }
  | { type: 'TOGGLE_SIM' }
  | { type: 'SET_MARKET_EVENT'; event: MarketEventType }
  | { type: 'SET_STOCK_PRICE'; ticker: string; price: number }
  | { type: 'RESET_ALL_PRICES' };

function buildStockMap(stockList: Stock[]): Record<string, Stock> {
  return Object.fromEntries(stockList.map((s) => [s.ticker, s]));
}

const EVENT_MODIFIERS: Record<MarketEventType, { trendMultiplier: number; volatilityMultiplier: number }> = {
  normal:      { trendMultiplier: 1,    volatilityMultiplier: 1 },
  bull_run:    { trendMultiplier: 8,    volatilityMultiplier: 1.5 },
  bear_market: { trendMultiplier: -6,   volatilityMultiplier: 2 },
  black_swan:  { trendMultiplier: -15,  volatilityMultiplier: 5 },
  recovery:    { trendMultiplier: 4,    volatilityMultiplier: 0.8 },
};

function applyMarketEvent(stocks: Record<string, Stock>, event: MarketEventType): Record<string, Stock> {
  const mod = EVENT_MODIFIERS[event];
  const result: Record<string, Stock> = {};
  for (const ticker in stocks) {
    const s = stocks[ticker];
    const baseTrend = SEED_STOCKS.find((seed) => seed.ticker === ticker)?.trend ?? 0.0002;
    const baseVolatility = SEED_STOCKS.find((seed) => seed.ticker === ticker)?.volatility ?? 0.012;
    result[ticker] = {
      ...s,
      trend: baseTrend * mod.trendMultiplier,
      volatility: baseVolatility * mod.volatilityMultiplier,
    };
  }
  return result;
}

function stockReducer(state: StockState, action: StockAction): StockState {
  switch (action.type) {
    case 'INIT_STOCKS':
      return { ...state, stocks: buildStockMap(SEED_STOCKS) };
    case 'TICK':
      return { ...state, stocks: simulateAllTicks(state.stocks), lastTickAt: Date.now() };
    case 'TOGGLE_SIM':
      return { ...state, isSimulating: !state.isSimulating };
    case 'SET_MARKET_EVENT': {
      const updatedStocks = applyMarketEvent(state.stocks, action.event);
      return { ...state, stocks: updatedStocks, marketEvent: action.event };
    }
    case 'SET_STOCK_PRICE': {
      const stock = state.stocks[action.ticker];
      if (!stock) return state;
      return {
        ...state,
        stocks: {
          ...state.stocks,
          [action.ticker]: { ...stock, currentPrice: action.price },
        },
      };
    }
    case 'RESET_ALL_PRICES':
      return {
        ...state,
        stocks: buildStockMap(SEED_STOCKS),
        marketEvent: 'normal',
      };
    default:
      return state;
  }
}

// ===========================
// CONTEXT
// ===========================

interface StockContextValue {
  stocks: Record<string, Stock>;
  stockList: Stock[];
  getStock: (ticker: string) => Stock | undefined;
  isSimulating: boolean;
  toggleSimulation: () => void;
  lastTickAt: number;
  marketEvent: MarketEventType;
  setMarketEvent: (event: MarketEventType) => void;
  setStockPrice: (ticker: string, price: number) => void;
  resetAllPrices: () => void;
}

export const StockContext = createContext<StockContextValue | null>(null);

export function StockProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(stockReducer, {
    stocks: buildStockMap(SEED_STOCKS),
    lastTickAt: Date.now(),
    isSimulating: true,
    marketEvent: 'normal',
  });

  useEffect(() => {
    if (!state.isSimulating) return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), TICK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [state.isSimulating]);

  const getStock = useCallback((ticker: string) => state.stocks[ticker], [state.stocks]);
  const toggleSimulation = useCallback(() => dispatch({ type: 'TOGGLE_SIM' }), []);
  const setMarketEvent = useCallback((event: MarketEventType) => dispatch({ type: 'SET_MARKET_EVENT', event }), []);
  const setStockPrice = useCallback((ticker: string, price: number) => dispatch({ type: 'SET_STOCK_PRICE', ticker, price }), []);
  const resetAllPrices = useCallback(() => dispatch({ type: 'RESET_ALL_PRICES' }), []);

  return (
    <StockContext.Provider value={{
      stocks: state.stocks,
      stockList: Object.values(state.stocks),
      getStock,
      isSimulating: state.isSimulating,
      toggleSimulation,
      lastTickAt: state.lastTickAt,
      marketEvent: state.marketEvent,
      setMarketEvent,
      setStockPrice,
      resetAllPrices,
    }}>
      {children}
    </StockContext.Provider>
  );
}
