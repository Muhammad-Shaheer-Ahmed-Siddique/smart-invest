import { Skeleton, SkeletonCard } from '@/components/ui';

export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="h-7 w-36 mb-2" />
        <Skeleton className="h-4 w-60" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          <SkeletonCard className="h-72" />
        </div>
        <SkeletonCard className="h-72" />
      </div>
    </div>
  );
}
