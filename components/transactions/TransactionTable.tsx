'use client';

import { useState, useMemo } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Badge, Button } from '@/components/ui';
import { ITEMS_PER_PAGE } from '@/lib/constants';

export function TransactionTable() {
  const { transactions } = usePortfolio();
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = transactions;
    if (typeFilter !== 'ALL') list = list.filter((t) => t.type === typeFilter);
    if (search) list = list.filter((t) => t.ticker.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [transactions, typeFilter, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (transactions.length === 0) {
    return (
      <div className="py-16 text-center text-[var(--text-muted)] text-sm">
        No transactions yet. Buy your first stock!
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex rounded-lg overflow-hidden border border-[var(--border-color)]">
          {(['ALL', 'BUY', 'SELL'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setTypeFilter(f); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                typeFilter === f
                  ? 'bg-brand-500 text-white'
                  : 'bg-[var(--bg-1)] text-[var(--text-secondary)] hover:bg-[var(--bg-2)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Filter by ticker..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-0)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500 w-40"
        />
        <span className="text-xs text-[var(--text-muted)] ml-auto">
          {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg-1)] border-b border-[var(--border-color)]">
              {['Type', 'Stock', 'Shares', 'Price', 'Total', 'Balance After', 'Date'].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-[var(--text-muted)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-[var(--bg-0)] divide-y divide-[var(--border-color)]">
            {paginated.map((tx) => (
              <tr key={tx.id} className="hover:bg-[var(--bg-1)] transition-colors">
                <td className="px-4 py-3">
                  <Badge variant={tx.type === 'BUY' ? 'success' : 'danger'}>
                    {tx.type}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">{tx.ticker}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)] tabular-nums">{tx.shares}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)] tabular-nums">
                  {formatCurrency(tx.pricePerShare)}
                </td>
                <td className={`px-4 py-3 font-medium tabular-nums ${
                  tx.type === 'BUY' ? 'text-danger-500' : 'text-brand-500'
                }`}>
                  {tx.type === 'BUY' ? '-' : '+'}{formatCurrency(tx.totalValue)}
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)] tabular-nums">
                  {formatCurrency(tx.balanceAfter)}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--text-muted)] whitespace-nowrap">
                  {formatDate(tx.timestamp, 'short')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-[var(--text-muted)]">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
