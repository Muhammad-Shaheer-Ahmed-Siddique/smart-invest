'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { PricePoint } from '@/types';
import { formatCurrency } from '@/lib/formatters';

interface PriceChartProps {
  priceHistory: PricePoint[];
  color?: string;
}

const TIMEFRAMES = [
  { label: '1H', points: 30 },
  { label: '3H', points: 90 },
  { label: 'All', points: 200 },
];

export function PriceChart({ priceHistory, color = '#22c55e' }: PriceChartProps) {
  const [tf, setTf] = useState(0);

  const data = useMemo(() => {
    const slice = priceHistory.slice(-TIMEFRAMES[tf].points);
    return slice.map((p) => ({
      time: new Date(p.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      price: p.price,
    }));
  }, [priceHistory, tf]);

  const isPositive = data.length >= 2 ? data[data.length - 1].price >= data[0].price : true;
  const chartColor = isPositive ? '#22c55e' : '#ef4444';

  const minPrice = Math.min(...data.map((d) => d.price)) * 0.999;
  const maxPrice = Math.max(...data.map((d) => d.price)) * 1.001;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {TIMEFRAMES.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setTf(i)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              tf === i
                ? 'bg-brand-500 text-white'
                : 'bg-[var(--bg-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
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
            domain={[minPrice, maxPrice]}
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
            width={60}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-0)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--text-primary)',
            }}
            formatter={(v) => [formatCurrency(Number(v)), 'Price']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={chartColor}
            strokeWidth={2}
            fill="url(#priceGrad)"
            dot={false}
            activeDot={{ r: 4, fill: chartColor }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
