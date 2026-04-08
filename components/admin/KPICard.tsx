'use client';

import { useEffect, useRef } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';

type AccentColor = 'cyan' | 'green' | 'red' | 'purple' | 'gold';

interface KPICardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  sub?: string;
  subPositive?: boolean;
  icon: React.ReactNode;
  accent?: AccentColor;
  delay?: number;
  compact?: boolean;
}

const ACCENT_MAP: Record<AccentColor, {
  color: string; bg: string; border: string; glow: string;
}> = {
  cyan:   { color: '#00d4ff', bg: 'rgba(0,212,255,0.08)',   border: 'rgba(0,212,255,0.2)',   glow: '0 0 30px rgba(0,212,255,0.12)' },
  green:  { color: '#00ff88', bg: 'rgba(0,255,136,0.08)',   border: 'rgba(0,255,136,0.2)',   glow: '0 0 30px rgba(0,255,136,0.12)' },
  red:    { color: '#ff4455', bg: 'rgba(255,68,85,0.08)',   border: 'rgba(255,68,85,0.2)',   glow: '0 0 30px rgba(255,68,85,0.12)' },
  purple: { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)',  border: 'rgba(124,58,237,0.2)',  glow: '0 0 30px rgba(124,58,237,0.12)' },
  gold:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)',  glow: '0 0 30px rgba(245,158,11,0.12)' },
};

function AnimatedNumber({
  target, prefix = '', suffix = '', decimals = 0,
}: { target: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      onUpdate: (v) => {
        if (ref.current) {
          const formatted = decimals > 0 ? v.toFixed(decimals) : Math.floor(v).toLocaleString();
          ref.current.textContent = `${prefix}${formatted}${suffix}`;
        }
      },
    });
    return () => controls.stop();
  }, [target, prefix, suffix, decimals]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

export function KPICard({
  label, value, prefix = '', suffix = '', decimals = 0,
  sub, subPositive, icon, accent = 'cyan', delay = 0, compact = false,
}: KPICardProps) {
  const a = ACCENT_MAP[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`relative rounded-2xl overflow-hidden cursor-default ${compact ? 'p-4' : 'p-5'}`}
      style={{ background: a.bg, border: `1px solid ${a.border}`, boxShadow: a.glow, backdropFilter: 'blur(12px)' }}
    >
      {/* Decorative corner glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${a.color}18 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }} />

      {/* Icon */}
      <div className={`flex items-center justify-between ${compact ? 'mb-3' : 'mb-4'}`}>
        <div className="p-2 rounded-xl" style={{ background: `${a.color}18`, color: a.color }}>
          {icon}
        </div>
        {sub && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: subPositive ? 'rgba(0,255,136,0.12)' : 'rgba(255,68,85,0.12)',
              color: subPositive ? '#00ff88' : '#ff4455',
            }}>
            {sub}
          </span>
        )}
      </div>

      {/* Value */}
      <div className={`font-bold tabular-nums ${compact ? 'text-2xl' : 'text-3xl'}`} style={{ color: a.color }}>
        <AnimatedNumber target={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>

      {/* Label */}
      <div className="text-xs font-medium mt-1" style={{ color: 'var(--admin-muted)' }}>{label}</div>

      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.3, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
        style={{ background: `linear-gradient(90deg, ${a.color}, transparent)` }}
      />
    </motion.div>
  );
}
