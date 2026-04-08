import { cn } from '@/lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({ className, padding = 'md', children, ...props }: CardProps) {
  const paddingClass = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-5',
    lg: 'p-6',
  }[padding];

  return (
    <div
      className={cn(
        'bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] shadow-sm',
        paddingClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-base font-semibold text-[var(--text-primary)]', className)}
      {...props}
    >
      {children}
    </h3>
  );
}
