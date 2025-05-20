import { Skeleton } from '@/components/ui/skeleton';

export const ProductCardSkeleton = () => {
  return (
    <div className="product-card flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-4 left-4">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
      <div className="p-4 pt-0 mt-auto">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};
