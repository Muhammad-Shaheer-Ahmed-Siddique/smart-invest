import { Skeleton } from '@/components/ui';

export default function MarketLoading() {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="h-7 w-24 mb-2" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] flex gap-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center px-4 py-3 gap-4">
              <div className="flex items-center gap-3 w-48">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="flex-1 h-4 w-20" />
              <Skeleton className="w-16 h-5 rounded-full" />
              <Skeleton className="w-16 h-4 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
