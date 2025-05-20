'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '../products/components/ProductCard';
import { ProductCardSkeleton } from '../products/components/ProductCardSkeleton';
import { useProducts } from '@/lib/supabase/products';

export function FeaturedProducts() {
  const productsApi = useProducts();

  const {
    data: featuredProducts,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const products = await productsApi.getProducts();
      return products.filter(product => product.featured);
    },
    // Use stale time of 5 minutes since products don't change often
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="py-16 w-full flex justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Meals</h2>
          <Button variant="ghost" asChild>
            <Link href="/products">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : fetchError ? (
          <div className="text-red-500">
            Error loading featured products: {fetchError.message || 'Unknown error'}
          </div>
        ) : featuredProducts?.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No featured meals available</h3>
            <p className="text-muted-foreground mb-4">Check back later for new featured meals</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
