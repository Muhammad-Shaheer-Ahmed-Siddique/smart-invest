'use client';

import { useState } from 'react';
import { formatCurrency, formatPercent } from '@/lib/formatters';

export default function ROICalculatorPage() {
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [shares, setShares] = useState('');
  const [days, setDays] = useState('');

  const bp = parseFloat(buyPrice) || 0;
  const sp = parseFloat(sellPrice) || 0;
  const sh = parseFloat(shares) || 0;
  const d = parseFloat(days) || 0;

  const totalInvested = bp * sh;
  const totalReturn = sp * sh;
  const profit = totalReturn - totalInvested;
  const roi = totalInvested > 0 ? profit / totalInvested : 0;
  const annualized = d > 0 && totalInvested > 0 ? (Math.pow(totalReturn / totalInvested, 365 / d) - 1) : 0;
  const hasInput = bp > 0 && sp > 0 && sh > 0;

  return (
    <div className="neon-dashboard -m-4 md:-m-6 p-4 md:p-6 min-h-full bg-[var(--bg-1)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">ROI Calculator</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Calculate your return on investment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-[var(--bg-0)] rounded-2xl border border-[var(--border-color)] p-6">
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-5">Input Values</h2>
          <div className="space-y-4">
            {[
              { label: 'Buy Price ($)', value: buyPrice, set: setBuyPrice, placeholder: '150.00' },
              { label: 'Sell Price ($)', value: sellPrice, set: setSellPrice, placeholder: '185.00' },
              { label: 'Number of Shares', value: shares, set: setShares, placeholder: '100' },
              { label: 'Holding Period (days)', value: days, set: setDays, placeholder: '365' },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{f.label}</label>
                <input
                  type="number"
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-[var(--bg-1)] border border-[var(--border-color)] outline-none focus:border-[#00d4ff] transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="bg-[var(--bg-0)] rounded-2xl border border-[var(--border-color)] p-6">
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-5">Results</h2>
          {hasInput ? (
            <div className="space-y-4">
              {[
                { label: 'Total Investment', value: formatCurrency(totalInvested), color: 'var(--text-primary)' },
                { label: 'Total Return', value: formatCurrency(totalReturn), color: 'var(--text-primary)' },
                { label: 'Profit / Loss', value: `${profit >= 0 ? '+' : ''}${formatCurrency(profit)}`, color: profit >= 0 ? '#00ff88' : '#ff4455' },
                { label: 'ROI', value: `${roi >= 0 ? '+' : ''}${formatPercent(roi)}`, color: roi >= 0 ? '#00ff88' : '#ff4455' },
                { label: 'Annualized Return', value: d > 0 ? `${annualized >= 0 ? '+' : ''}${formatPercent(annualized)}` : 'Enter holding period', color: annualized >= 0 ? '#00d4ff' : '#ff4455' },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between py-3 border-b border-[var(--border-color)] last:border-0">
                  <span className="text-sm text-[var(--text-muted)]">{r.label}</span>
                  <span className="text-lg font-bold" style={{ color: r.color }}>{r.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-sm text-[var(--text-muted)]">
              Enter buy price, sell price, and shares to see results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
