import { getProducts } from '@/lib/supabase/server/products';
import { QueryProvider } from '@/providers/query-provider';
import { ProductCardSkeleton } from './components/ProductCardSkeleton';
import { ProductFiltersSkeleton } from './components/ProductFiltersSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default async function ProductsLayout({ children }: { children: React.ReactNode }) {
  // Fetch products on the server
  const products = await getProducts();

  return (
    <QueryProvider
      initialData={{
        products,
      }}
    >
      {!products?.length ? (
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 container px-4 md:px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <Skeleton className="h-9 w-48" />
              <div className="w-full md:w-auto flex items-center">
                <Skeleton className="h-10 w-full md:w-32" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <ProductFiltersSkeleton />
              <div className="col-span-1 md:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : (
        children
      )}
    </QueryProvider>
  );
}
