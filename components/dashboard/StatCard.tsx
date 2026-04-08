interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, sub, positive, icon }: StatCardProps) {
  return (
    <div className="bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[var(--text-muted)]">{label}</span>
        {icon && (
          <span className="text-[var(--text-muted)]">{icon}</span>
        )}
      </div>
      <div className="text-xl font-bold text-[var(--text-primary)]">{value}</div>
      {sub && (
        <div className={`text-xs mt-1 ${
          positive === undefined ? 'text-[var(--text-muted)]' :
          positive ? 'text-brand-500' : 'text-danger-500'
        }`}>
          {sub}
        </div>
      )}
    </div>
  );
}
