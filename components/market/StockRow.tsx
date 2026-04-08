'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Stock } from '@/types';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/formatters';
import { PriceTickerBadge } from './PriceTickerBadge';
import { Badge } from '@/components/ui';

interface StockRowProps {
  stock: Stock;
}

export function StockRow({ stock }: StockRowProps) {
  const prevPrice = useRef(stock.currentPrice);
  const [flashClass, setFlashClass] = useState('');

  const change = stock.currentPrice - stock.previousClose;
  const changePercent = stock.previousClose !== 0 ? change / stock.previousClose : 0;

  useEffect(() => {
    if (stock.currentPrice === prevPrice.current) return;
    const isUp = stock.currentPrice > prevPrice.current;
    setFlashClass(isUp ? 'price-flash-up' : 'price-flash-down');
    prevPrice.current = stock.currentPrice;
    const timer = setTimeout(() => setFlashClass(''), 700);
    return () => clearTimeout(timer);
  }, [stock.currentPrice]);

  return (
    <Link
      href={`/market/${stock.ticker}`}
      className="flex items-center px-4 py-3 hover:bg-[var(--bg-1)] transition-colors group"
    >
      {/* Ticker + Name */}
      <div className="flex items-center gap-3 w-48 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[var(--bg-2)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">
          {stock.ticker.slice(0, 2)}
        </div>
        <div>
          <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-brand-500 transition-colors">
            {stock.ticker}
          </div>
          <div className="text-xs text-[var(--text-muted)] truncate max-w-[100px]">{stock.name}</div>
        </div>
      </div>

      {/* Sector */}
      <div className="hidden lg:block w-28 shrink-0">
        <Badge variant="default" className="text-xs">{stock.sector}</Badge>
      </div>

      {/* Price */}
      <div className={cn('flex-1 text-sm font-semibold text-[var(--text-primary)] tabular-nums', flashClass)}>
        {formatCurrency(stock.currentPrice)}
      </div>

      {/* Change */}
      <div className="w-24 text-right">
        <PriceTickerBadge change={change} changePercent={changePercent} size="sm" />
      </div>

      {/* Market Cap */}
      <div className="hidden md:block w-24 text-right text-sm text-[var(--text-muted)]">
        {stock.marketCap}
      </div>
    </Link>
  );
}
