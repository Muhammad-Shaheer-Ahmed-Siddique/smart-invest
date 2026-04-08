'use client';

import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { usePortfolio } from '@/hooks/usePortfolio';
import { formatCurrency } from '@/lib/formatters';

export function NetWorthChart() {
  const { portfolio } = usePortfolio();

  const data = useMemo(() => {
    if (!portfolio) return [];
    return portfolio.netWorthHistory.map((s) => ({
      time: new Date(s.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      netWorth: s.netWorth,
    }));
  }, [portfolio]);

  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-[var(--text-muted)]">
        Net worth history will appear as you trade and time passes.
      </div>
    );
  }

  const first = data[0].netWorth;
  const last = data[data.length - 1].netWorth;
  const isPositive = last >= first;
  const color = isPositive ? '#22c55e' : '#ef4444';

  const minVal = Math.min(...data.map((d) => d.netWorth)) * 0.999;
  const maxVal = Math.max(...data.map((d) => d.netWorth)) * 1.001;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[minVal, maxVal]}
          tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCurrency(v, true)}
          width={70}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-0)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'var(--text-primary)',
          }}
          formatter={(v) => [formatCurrency(Number(v)), 'Net Worth']}
        />
        <Area
          type="monotone"
          dataKey="netWorth"
          stroke={color}
          strokeWidth={2}
          fill="url(#nwGrad)"
          dot={false}
          activeDot={{ r: 4, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
