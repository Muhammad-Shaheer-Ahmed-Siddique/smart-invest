'use client';

import { motion } from 'framer-motion';

interface NeonStatCardProps {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
  icon: React.ReactNode;
  glowClass: string;
  accentColor: string;
  delay?: number;
}

export function NeonStatCard({
  label,
  value,
  sub,
  positive,
  icon,
  glowClass,
  accentColor,
  delay = 0,
}: NeonStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`neon-card ${glowClass} p-5 relative overflow-hidden group`}
    >
      {/* Background accent glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold tracking-wider uppercase text-[var(--neon-muted)]">
            {label}
          </span>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: `${accentColor}12`,
              border: `1px solid ${accentColor}25`,
              color: accentColor,
            }}
          >
            {icon}
          </div>
        </div>

        <div className="text-2xl font-bold text-[var(--neon-text)] mb-1">{value}</div>

        {sub && (
          <div
            className={`text-xs font-medium ${
              positive === undefined
                ? 'text-[var(--neon-muted)]'
                : positive
                ? 'text-[#00ff88]'
                : 'text-[#ff4455]'
            }`}
          >
            {sub}
          </div>
        )}
      </div>
    </motion.div>
  );
}
