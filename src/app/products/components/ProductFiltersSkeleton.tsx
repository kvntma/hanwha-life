import { Skeleton } from '@/components/ui/skeleton';

export const ProductFiltersSkeleton = () => {
  return (
    <div className="md:block">
      <div className="sticky top-20 rounded-lg bg-card border border-border p-4">
        <Skeleton className="h-7 w-20 mb-4" />
        <div className="mb-6">
          <Skeleton className="h-5 w-24 mb-2" />
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
