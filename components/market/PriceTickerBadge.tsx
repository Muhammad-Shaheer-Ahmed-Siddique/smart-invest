import { cn } from '@/lib/cn';
import { formatPercent } from '@/lib/formatters';

interface PriceTickerBadgeProps {
  change: number;
  changePercent: number;
  showAbsolute?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function PriceTickerBadge({
  change,
  changePercent,
  showAbsolute = false,
  size = 'md',
  className,
}: PriceTickerBadgeProps) {
  const isPositive = change >= 0;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 font-medium rounded-full',
        size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-0.5',
        isPositive
          ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
          : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
        className
      )}
    >
      {isPositive ? (
        <svg className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ) : (
        <svg className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      )}
      {showAbsolute && `$${Math.abs(change).toFixed(2)} `}
      {formatPercent(Math.abs(changePercent))}
    </span>
  );
}
