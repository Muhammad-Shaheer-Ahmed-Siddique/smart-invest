'use client';

import { useEffect, useContext } from 'react';
import { PortfolioContext } from '@/contexts/PortfolioContext';
import { cn } from '@/lib/cn';

const icons = {
  success: (
    <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

export function ToastNotifications() {
  const ctx = useContext(PortfolioContext);

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (!ctx || ctx.notifications.length === 0) return;
    const oldest = ctx.notifications[ctx.notifications.length - 1];
    const age = Date.now() - oldest.timestamp;
    const remaining = Math.max(0, 4000 - age);
    const timer = setTimeout(() => {
      ctx.dismissNotification(oldest.id);
    }, remaining);
    return () => clearTimeout(timer);
  }, [ctx]);

  if (!ctx || ctx.notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {ctx.notifications.map((n) => (
        <div
          key={n.id}
          className={cn(
            'flex items-start gap-3 p-3.5 rounded-xl border shadow-lg bg-[var(--bg-0)] text-sm',
            n.type === 'success' && 'border-brand-500/30',
            n.type === 'error' && 'border-danger-500/30',
            n.type === 'info' && 'border-blue-500/30',
            n.type === 'warning' && 'border-warning-500/30',
          )}
        >
          <span className="mt-0.5 shrink-0">{icons[n.type]}</span>
          <span className="flex-1 text-[var(--text-primary)]">{n.message}</span>
          <button
            onClick={() => ctx.dismissNotification(n.id)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
