'use client';

import { useContext } from 'react';
import { StockContext } from '@/contexts/StockContext';

export function useStocks() {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error('useStocks must be used within StockProvider');
  return ctx;
}

export function useStockPrice(ticker: string) {
  const { getStock } = useStocks();
  const stock = getStock(ticker);
  if (!stock) return null;
  const change = stock.currentPrice - stock.previousClose;
  const changePercent = stock.previousClose !== 0 ? change / stock.previousClose : 0;
  return {
    price: stock.currentPrice,
    change,
    changePercent,
    priceHistory: stock.priceHistory,
    isPositive: change >= 0,
  };
}
