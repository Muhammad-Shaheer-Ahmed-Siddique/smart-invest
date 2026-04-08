'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useStocks } from '@/hooks/useStocks';
import { formatCurrency } from '@/lib/formatters';
import { calculateAllocation } from '@/lib/portfolio';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

export function AllocationPieChart() {
  const { portfolio } = usePortfolio();
  const { stocks } = useStocks();

  const data = useMemo(() => {
    if (!portfolio) return [];
    const prices: Record<string, number> = {};
    for (const t in stocks) prices[t] = stocks[t].currentPrice;
    return calculateAllocation(portfolio.holdings, prices).map((a) => ({
      name: a.ticker,
      value: a.value,
      percent: a.percent,
    }));
  }, [portfolio, stocks]);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-[var(--text-muted)] text-sm">
        No holdings yet. Buy some stocks to see allocation.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'var(--bg-0)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(v, name) => [formatCurrency(Number(v)), String(name)]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(v) => <span className="text-xs text-[var(--text-secondary)]">{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
