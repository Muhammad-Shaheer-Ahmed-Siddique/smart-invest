'use client';

import { createContext, useReducer, useEffect, useCallback, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Portfolio, Transaction, AppNotification, Holding, NetWorthSnapshot } from '@/types';
import { AuthContext } from '@/contexts/AuthContext';
import { StockContext } from '@/contexts/StockContext';
import {
  getPortfolio, savePortfolio, getTransactions, saveTransactions,
} from '@/lib/storage';
import {
  validateBuyOrder, validateSellOrder, computeNewAvgCost, calculateNetWorth,
} from '@/lib/portfolio';
import { getPriceMap } from '@/lib/stockEngine';
import { TRANSACTION_FEE, NET_WORTH_SNAPSHOT_INTERVAL_MS } from '@/lib/constants';

// ===========================
// STATE
// ===========================

interface PortfolioState {
  portfolio: Portfolio | null;
  transactions: Transaction[];
  notifications: AppNotification[];
}

type PortfolioAction =
  | { type: 'INIT_PORTFOLIO'; portfolio: Portfolio; transactions: Transaction[] }
  | { type: 'BUY'; transaction: Transaction; portfolio: Portfolio }
  | { type: 'SELL'; transaction: Transaction; portfolio: Portfolio }
  | { type: 'SNAPSHOT_NET_WORTH'; snapshot: NetWorthSnapshot }
  | { type: 'WATCHLIST_ADD'; ticker: string }
  | { type: 'WATCHLIST_REMOVE'; ticker: string }
  | { type: 'ADD_NOTIFICATION'; notification: AppNotification }
  | { type: 'DISMISS_NOTIFICATION'; id: string }
  | { type: 'CLEAR_PORTFOLIO' };

function portfolioReducer(state: PortfolioState, action: PortfolioAction): PortfolioState {
  switch (action.type) {
    case 'INIT_PORTFOLIO':
      return { ...state, portfolio: action.portfolio, transactions: action.transactions };

    case 'BUY':
    case 'SELL':
      return {
        ...state,
        portfolio: action.portfolio,
        transactions: [action.transaction, ...state.transactions],
      };

    case 'SNAPSHOT_NET_WORTH': {
      if (!state.portfolio) return state;
      const history = [...state.portfolio.netWorthHistory, action.snapshot];
      if (history.length > 500) history.shift();
      return { ...state, portfolio: { ...state.portfolio, netWorthHistory: history } };
    }

    case 'WATCHLIST_ADD': {
      if (!state.portfolio) return state;
      if (state.portfolio.watchlist.includes(action.ticker)) return state;
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          watchlist: [...state.portfolio.watchlist, action.ticker],
        },
      };
    }

    case 'WATCHLIST_REMOVE': {
      if (!state.portfolio) return state;
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          watchlist: state.portfolio.watchlist.filter((t) => t !== action.ticker),
        },
      };
    }

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.notification, ...state.notifications].slice(0, 5),
      };

    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.id),
      };

    case 'CLEAR_PORTFOLIO':
      return { portfolio: null, transactions: [], notifications: [] };

    default:
      return state;
  }
}

// ===========================
// CONTEXT
// ===========================

interface PortfolioContextValue {
  portfolio: Portfolio | null;
  transactions: Transaction[];
  notifications: AppNotification[];
  buyStock: (ticker: string, shares: number, price: number) => string | null;
  sellStock: (ticker: string, shares: number, price: number) => string | null;
  getHolding: (ticker: string) => Holding | undefined;
  currentNetWorth: number;
  addToWatchlist: (ticker: string) => void;
  removeFromWatchlist: (ticker: string) => void;
  dismissNotification: (id: string) => void;
}

export const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const stockCtx = useContext(StockContext);

  const [state, dispatch] = useReducer(portfolioReducer, {
    portfolio: null,
    transactions: [],
    notifications: [],
  });

  // Load portfolio when user logs in
  useEffect(() => {
    if (!auth?.user) {
      dispatch({ type: 'CLEAR_PORTFOLIO' });
      return;
    }
    const portfolio = getPortfolio(auth.user.id);
    const transactions = getTransactions(auth.user.id);
    if (portfolio) {
      dispatch({ type: 'INIT_PORTFOLIO', portfolio, transactions });
    }
  }, [auth?.user]);

  // Auto-save portfolio to localStorage
  useEffect(() => {
    if (state.portfolio) {
      savePortfolio(state.portfolio);
    }
  }, [state.portfolio]);

  // Auto-save transactions
  useEffect(() => {
    if (auth?.user && state.transactions.length > 0) {
      saveTransactions(auth.user.id, state.transactions);
    }
  }, [state.transactions, auth?.user]);

  // Net worth snapshot interval
  useEffect(() => {
    if (!state.portfolio || !stockCtx) return;
    const id = setInterval(() => {
      const prices = getPriceMap(stockCtx.stocks);
      const netWorth = calculateNetWorth(state.portfolio!, prices);
      dispatch({
        type: 'SNAPSHOT_NET_WORTH',
        snapshot: {
          timestamp: Date.now(),
          netWorth,
          cashBalance: state.portfolio!.cashBalance,
          portfolioValue: netWorth - state.portfolio!.cashBalance,
        },
      });
    }, NET_WORTH_SNAPSHOT_INTERVAL_MS);
    return () => clearInterval(id);
  }, [state.portfolio, stockCtx]);

  const buyStock = useCallback(
    (ticker: string, shares: number, price: number): string | null => {
      if (!state.portfolio || !auth?.user) return 'Not authenticated';
      const error = validateBuyOrder(shares, price, state.portfolio.cashBalance);
      if (error) return error;

      const totalCost = shares * price + TRANSACTION_FEE;
      const existing = state.portfolio.holdings[ticker];
      const newHolding: Holding = existing
        ? {
            ticker,
            shares: existing.shares + shares,
            avgCostBasis: computeNewAvgCost(existing, shares, price),
            totalInvested: existing.totalInvested + shares * price,
          }
        : { ticker, shares, avgCostBasis: price, totalInvested: shares * price };

      const newBalance = state.portfolio.cashBalance - totalCost;
      const transaction: Transaction = {
        id: uuidv4(),
        userId: auth.user.id,
        ticker,
        type: 'BUY',
        shares,
        pricePerShare: price,
        totalValue: shares * price,
        fee: TRANSACTION_FEE,
        timestamp: Date.now(),
        balanceAfter: newBalance,
      };

      const newPortfolio: Portfolio = {
        ...state.portfolio,
        cashBalance: newBalance,
        holdings: { ...state.portfolio.holdings, [ticker]: newHolding },
      };

      dispatch({ type: 'BUY', transaction, portfolio: newPortfolio });
      dispatch({
        type: 'ADD_NOTIFICATION',
        notification: {
          id: uuidv4(),
          type: 'success',
          message: `Bought ${shares} share${shares !== 1 ? 's' : ''} of ${ticker} at $${price.toFixed(2)}`,
          timestamp: Date.now(),
        },
      });
      return null;
    },
    [state.portfolio, auth?.user]
  );

  const sellStock = useCallback(
    (ticker: string, shares: number, price: number): string | null => {
      if (!state.portfolio || !auth?.user) return 'Not authenticated';
      const holding = state.portfolio.holdings[ticker];
      const error = validateSellOrder(shares, holding);
      if (error) return error;

      const proceeds = shares * price - TRANSACTION_FEE;
      const newShares = holding.shares - shares;
      const newBalance = state.portfolio.cashBalance + proceeds;

      const newHoldings = { ...state.portfolio.holdings };
      if (newShares <= 0) {
        delete newHoldings[ticker];
      } else {
        newHoldings[ticker] = {
          ...holding,
          shares: newShares,
          totalInvested: holding.totalInvested - (shares / holding.shares) * holding.totalInvested,
        };
      }

      const transaction: Transaction = {
        id: uuidv4(),
        userId: auth.user.id,
        ticker,
        type: 'SELL',
        shares,
        pricePerShare: price,
        totalValue: shares * price,
        fee: TRANSACTION_FEE,
        timestamp: Date.now(),
        balanceAfter: newBalance,
      };

      const newPortfolio: Portfolio = {
        ...state.portfolio,
        cashBalance: newBalance,
        holdings: newHoldings,
      };

      dispatch({ type: 'SELL', transaction, portfolio: newPortfolio });
      dispatch({
        type: 'ADD_NOTIFICATION',
        notification: {
          id: uuidv4(),
          type: 'success',
          message: `Sold ${shares} share${shares !== 1 ? 's' : ''} of ${ticker} at $${price.toFixed(2)}`,
          timestamp: Date.now(),
        },
      });
      return null;
    },
    [state.portfolio, auth?.user]
  );

  const getHolding = useCallback(
    (ticker: string) => state.portfolio?.holdings[ticker],
    [state.portfolio]
  );

  const currentNetWorth = (() => {
    if (!state.portfolio || !stockCtx) return 0;
    const prices = getPriceMap(stockCtx.stocks);
    return calculateNetWorth(state.portfolio, prices);
  })();

  const addToWatchlist = useCallback((ticker: string) => {
    dispatch({ type: 'WATCHLIST_ADD', ticker });
  }, []);

  const removeFromWatchlist = useCallback((ticker: string) => {
    dispatch({ type: 'WATCHLIST_REMOVE', ticker });
  }, []);

  const dismissNotification = useCallback((id: string) => {
    dispatch({ type: 'DISMISS_NOTIFICATION', id });
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        portfolio: state.portfolio,
        transactions: state.transactions,
        notifications: state.notifications,
        buyStock,
        sellStock,
        getHolding,
        currentNetWorth,
        addToWatchlist,
        removeFromWatchlist,
        dismissNotification,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}
