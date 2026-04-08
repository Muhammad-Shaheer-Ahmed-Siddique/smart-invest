'use client';

import { useState } from 'react';
import type { Stock } from '@/types';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Button, Input, Modal } from '@/components/ui';
import { formatCurrency } from '@/lib/formatters';

interface BuySellPanelProps {
  stock: Stock;
}

export function BuySellPanel({ stock }: BuySellPanelProps) {
  const { buyStock, sellStock, getHolding, portfolio } = usePortfolio();
  const [mode, setMode] = useState<'BUY' | 'SELL'>('BUY');
  const [sharesInput, setSharesInput] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const shares = parseFloat(sharesInput) || 0;
  const holding = getHolding(stock.ticker);
  const totalCost = shares * stock.currentPrice;
  const cashBalance = portfolio?.cashBalance ?? 0;
  const maxBuyShares = Math.floor(cashBalance / stock.currentPrice);

  function handleReview() {
    if (!shares || shares <= 0) {
      setOrderError('Enter a valid number of shares');
      return;
    }
    setOrderError(null);
    setConfirmOpen(true);
  }

  function handleConfirm() {
    const error =
      mode === 'BUY'
        ? buyStock(stock.ticker, shares, stock.currentPrice)
        : sellStock(stock.ticker, shares, stock.currentPrice);

    if (error) {
      setOrderError(error);
      setConfirmOpen(false);
    } else {
      setConfirmOpen(false);
      setSharesInput('');
      setSuccessMsg(
        mode === 'BUY'
          ? `Bought ${shares} share${shares !== 1 ? 's' : ''} of ${stock.ticker}`
          : `Sold ${shares} share${shares !== 1 ? 's' : ''} of ${stock.ticker}`
      );
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  }

  return (
    <>
      <div className="bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] p-5">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Place Order</h3>

        {/* Mode toggle */}
        <div className="flex rounded-lg overflow-hidden border border-[var(--border-color)] mb-4">
          <button
            onClick={() => { setMode('BUY'); setOrderError(null); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === 'BUY'
                ? 'bg-brand-500 text-white'
                : 'bg-[var(--bg-1)] text-[var(--text-secondary)] hover:bg-[var(--bg-2)]'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => { setMode('SELL'); setOrderError(null); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === 'SELL'
                ? 'bg-danger-500 text-white'
                : 'bg-[var(--bg-1)] text-[var(--text-secondary)] hover:bg-[var(--bg-2)]'
            }`}
          >
            Sell
          </button>
        </div>

        {/* Shares input */}
        <Input
          label="Number of shares"
          type="number"
          min="1"
          step="1"
          placeholder="0"
          value={sharesInput}
          onChange={(e) => { setSharesInput(e.target.value); setOrderError(null); }}
          error={orderError ?? undefined}
          hint={
            mode === 'BUY'
              ? `Max: ${maxBuyShares} shares`
              : holding
              ? `You own: ${holding.shares} shares`
              : 'You own 0 shares'
          }
        />

        {/* Summary */}
        {shares > 0 && (
          <div className="mt-3 p-3 rounded-lg bg-[var(--bg-1)] space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Price per share</span>
              <span className="text-[var(--text-primary)]">{formatCurrency(stock.currentPrice)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-[var(--text-muted)]">
                {mode === 'BUY' ? 'Total cost' : 'Total proceeds'}
              </span>
              <span className={mode === 'BUY' ? 'text-danger-500' : 'text-brand-500'}>
                {formatCurrency(totalCost)}
              </span>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mt-3 p-3 rounded-lg bg-brand-500/10 border border-brand-500/20 text-sm text-brand-600 dark:text-brand-400">
            {successMsg}
          </div>
        )}

        <Button
          className="w-full mt-4"
          variant={mode === 'BUY' ? 'primary' : 'danger'}
          onClick={handleReview}
          disabled={!shares || shares <= 0}
        >
          Review {mode === 'BUY' ? 'Buy' : 'Sell'} Order
        </Button>

        {/* Cash balance */}
        <div className="mt-3 text-center text-xs text-[var(--text-muted)]">
          Available: {formatCurrency(cashBalance)}
        </div>
      </div>

      {/* Confirm modal */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm Order"
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-[var(--bg-1)] space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Action</span>
              <span className={`font-semibold ${mode === 'BUY' ? 'text-brand-500' : 'text-danger-500'}`}>
                {mode}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Stock</span>
              <span className="font-semibold text-[var(--text-primary)]">{stock.ticker}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Shares</span>
              <span className="text-[var(--text-primary)]">{shares}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Price</span>
              <span className="text-[var(--text-primary)]">{formatCurrency(stock.currentPrice)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t border-[var(--border-color)] pt-2">
              <span className="text-[var(--text-secondary)]">Total</span>
              <span className="text-[var(--text-primary)]">{formatCurrency(totalCost)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              variant={mode === 'BUY' ? 'primary' : 'danger'}
              onClick={handleConfirm}
            >
              Confirm {mode === 'BUY' ? 'Buy' : 'Sell'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
