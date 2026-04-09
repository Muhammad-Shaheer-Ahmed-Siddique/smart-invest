'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency } from '@/lib/formatters';

interface PriceAlert {
  id: string;
  ticker: string;
  targetPrice: number;
  direction: 'above' | 'below';
  createdAt: number;
  triggered: boolean;
  triggeredAt?: number;
}

const STORAGE_KEY = 'si_price_alerts';

function loadAlerts(): PriceAlert[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function saveAlerts(alerts: PriceAlert[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

export default function PriceAlertsPage() {
  const { stockList, getStock } = useStocks();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [ticker, setTicker] = useState('AAPL');
  const [targetPrice, setTargetPrice] = useState('');
  const [direction, setDirection] = useState<'above' | 'below'>('above');

  useEffect(() => { setAlerts(loadAlerts()); }, []);

  // Check alerts against current prices
  const checkAlerts = useCallback(() => {
    setAlerts((prev) => {
      let changed = false;
      const updated = prev.map((alert) => {
        if (alert.triggered) return alert;
        const stock = getStock(alert.ticker);
        if (!stock) return alert;
        const hit = alert.direction === 'above' ? stock.currentPrice >= alert.targetPrice : stock.currentPrice <= alert.targetPrice;
        if (hit) { changed = true; return { ...alert, triggered: true, triggeredAt: Date.now() }; }
        return alert;
      });
      if (changed) saveAlerts(updated);
      return changed ? updated : prev;
    });
  }, [getStock]);

  useEffect(() => {
    const id = setInterval(checkAlerts, 2000);
    return () => clearInterval(id);
  }, [checkAlerts]);

  function addAlert() {
    const tp = parseFloat(targetPrice);
    if (!tp || tp <= 0) return;
    const newAlert: PriceAlert = { id: Date.now().toString(), ticker, targetPrice: tp, direction, createdAt: Date.now(), triggered: false };
    const updated = [...alerts, newAlert];
    setAlerts(updated);
    saveAlerts(updated);
    setTargetPrice('');
  }

  function removeAlert(id: string) {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    saveAlerts(updated);
  }

  const active = alerts.filter((a) => !a.triggered);
  const triggered = alerts.filter((a) => a.triggered);

  return (
    <div className="neon-dashboard -m-4 md:-m-6 p-4 md:p-6 min-h-full bg-[var(--bg-1)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Price Alerts</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Get notified when stocks hit your target price</p>
      </div>

      {/* Add alert form */}
      <div className="bg-[var(--bg-0)] rounded-2xl border border-[var(--border-color)] p-6 mb-6">
        <h2 className="text-base font-bold text-[var(--text-primary)] mb-4">Create Alert</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={ticker} onChange={(e) => setTicker(e.target.value)} className="px-4 py-3 rounded-xl text-sm bg-[var(--bg-1)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
            {stockList.map((s) => <option key={s.ticker} value={s.ticker}>{s.ticker} — {formatCurrency(s.currentPrice)}</option>)}
          </select>
          <select value={direction} onChange={(e) => setDirection(e.target.value as 'above' | 'below')} className="px-4 py-3 rounded-xl text-sm bg-[var(--bg-1)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
            <option value="above">Price goes above</option>
            <option value="below">Price goes below</option>
          </select>
          <input type="number" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} placeholder="Target price" className="px-4 py-3 rounded-xl text-sm bg-[var(--bg-1)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none flex-1" />
          <button onClick={addAlert} className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:shadow-lg transition-all">
            Add Alert
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active alerts */}
        <div className="bg-[var(--bg-0)] rounded-2xl border border-[var(--border-color)] p-6">
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00d4ff] live-dot" />
            Active Alerts ({active.length})
          </h2>
          {active.length === 0 ? (
            <div className="text-sm text-[var(--text-muted)] py-8 text-center">No active alerts</div>
          ) : (
            <div className="space-y-2">
              {active.map((alert) => {
                const stock = getStock(alert.ticker);
                const currentPrice = stock?.currentPrice ?? 0;
                const diff = alert.direction === 'above' ? alert.targetPrice - currentPrice : currentPrice - alert.targetPrice;
                const progress = Math.max(0, Math.min(100, (1 - diff / alert.targetPrice) * 100));
                return (
                  <div key={alert.id} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-1)]">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-[var(--text-primary)]">{alert.ticker}</span>
                        <span className="text-xs text-[var(--text-muted)]">{alert.direction === 'above' ? '\u2191 above' : '\u2193 below'} {formatCurrency(alert.targetPrice)}</span>
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">Current: {formatCurrency(currentPrice)}</div>
                      <div className="w-full h-1.5 bg-[var(--bg-2)] rounded-full mt-2">
                        <div className="h-full bg-[#00d4ff] rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                    <button onClick={() => removeAlert(alert.id)} className="text-[var(--text-muted)] hover:text-[#ff4455] transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Triggered alerts */}
        <div className="bg-[var(--bg-0)] rounded-2xl border border-[var(--border-color)] p-6">
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
            Triggered ({triggered.length})
          </h2>
          {triggered.length === 0 ? (
            <div className="text-sm text-[var(--text-muted)] py-8 text-center">No triggered alerts yet</div>
          ) : (
            <div className="space-y-2">
              {triggered.map((alert) => (
                <div key={alert.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#00ff88]/20 bg-[#00ff88]/5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[var(--text-primary)]">{alert.ticker}</span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-[#00ff88]/10 text-[#00ff88] font-bold">TRIGGERED</span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">{alert.direction === 'above' ? 'Crossed above' : 'Dropped below'} {formatCurrency(alert.targetPrice)}</div>
                  </div>
                  <button onClick={() => removeAlert(alert.id)} className="text-[var(--text-muted)] hover:text-[#ff4455] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
