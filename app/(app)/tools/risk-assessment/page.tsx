'use client';

import { useMemo } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useStocks } from '@/hooks/useStocks';
import { formatPercent } from '@/lib/formatters';

function RiskGauge({ score }: { score: number }) {
  const color = score < 30 ? '#00ff88' : score < 60 ? '#fbbf24' : '#ff4455';
  const label = score < 30 ? 'Low Risk' : score < 60 ? 'Moderate Risk' : 'High Risk';
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-2)" strokeWidth="10" />
          <circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${score * 3.14} 314`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-extrabold text-[var(--text-primary)]">{score}</div>
          <div className="text-xs text-[var(--text-muted)]">/ 100</div>
        </div>
      </div>
      <div className="text-base font-bold mt-3" style={{ color }}>{label}</div>
    </div>
  );
}

export default function RiskAssessmentPage() {
  const { portfolio } = usePortfolio();
  const { stocks } = useStocks();

  const analysis = useMemo(() => {
    if (!portfolio) return null;
    const holdings = Object.values(portfolio.holdings);
    if (holdings.length === 0) return null;

    const prices: Record<string, number> = {};
    for (const t in stocks) prices[t] = stocks[t].currentPrice;

    // Portfolio value per holding
    const values = holdings.map((h) => ({ ticker: h.ticker, value: h.shares * (prices[h.ticker] || 0), volatility: stocks[h.ticker]?.volatility || 0, sector: stocks[h.ticker]?.sector || 'Unknown' }));
    const totalValue = values.reduce((s, v) => s + v.value, 0);
    if (totalValue === 0) return null;

    // Weights
    const weights = values.map((v) => ({ ...v, weight: v.value / totalValue }));

    // 1. Portfolio volatility (weighted avg)
    const portfolioVolatility = weights.reduce((s, w) => s + w.weight * w.volatility, 0);

    // 2. Concentration (HHI) - sum of squared weights
    const hhi = weights.reduce((s, w) => s + w.weight * w.weight, 0);

    // 3. Sector diversification
    const sectorSet = new Set(weights.map((w) => w.sector));
    const sectorCount = sectorSet.size;

    // 4. Largest position
    const largestPosition = Math.max(...weights.map((w) => w.weight));

    // Risk score (0-100)
    const volScore = Math.min(portfolioVolatility / 0.04 * 100, 100); // 4% vol = max
    const concScore = hhi * 100; // HHI 0-1
    const divScore = Math.max(100 - sectorCount * 15, 0); // More sectors = lower risk
    const posScore = largestPosition * 100; // Largest pos weight

    const riskScore = Math.round(volScore * 0.3 + concScore * 0.25 + divScore * 0.2 + posScore * 0.25);

    return {
      riskScore: Math.min(riskScore, 100),
      portfolioVolatility,
      hhi,
      sectorCount,
      largestPosition,
      largestTicker: weights.reduce((a, b) => a.weight > b.weight ? a : b).ticker,
      holdingCount: holdings.length,
    };
  }, [portfolio, stocks]);

  return (
    <div className="neon-dashboard -m-4 md:-m-6 p-4 md:p-6 min-h-full bg-[var(--bg-1)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Risk Assessment</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Evaluate your portfolio risk and diversification</p>
      </div>

      {!analysis ? (
        <div className="bg-[var(--bg-0)] rounded-2xl border border-[var(--border-color)] p-12 text-center text-[var(--text-muted)]">
          No holdings yet. Buy some stocks to see risk analysis.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk gauge */}
          <div className="bg-[var(--bg-0)] rounded-2xl border border-[var(--border-color)] p-8 flex items-center justify-center">
            <RiskGauge score={analysis.riskScore} />
          </div>

          {/* Metrics */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {[
              { label: 'Portfolio Volatility', value: formatPercent(analysis.portfolioVolatility), desc: 'Weighted average volatility of your holdings', color: analysis.portfolioVolatility > 0.02 ? '#ff4455' : '#00ff88' },
              { label: 'Concentration (HHI)', value: (analysis.hhi * 100).toFixed(1) + '%', desc: 'Lower is better. 100% = single stock', color: analysis.hhi > 0.5 ? '#ff4455' : '#00ff88' },
              { label: 'Sector Coverage', value: `${analysis.sectorCount} / 8`, desc: 'Number of sectors in your portfolio', color: analysis.sectorCount >= 4 ? '#00ff88' : '#fbbf24' },
              { label: 'Largest Position', value: formatPercent(analysis.largestPosition), desc: `${analysis.largestTicker} — ${analysis.holdingCount} total holdings`, color: analysis.largestPosition > 0.5 ? '#ff4455' : '#00ff88' },
            ].map((m) => (
              <div key={m.label} className="bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] p-5">
                <div className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">{m.label}</div>
                <div className="text-2xl font-bold mb-1" style={{ color: m.color }}>{m.value}</div>
                <div className="text-xs text-[var(--text-muted)]">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
