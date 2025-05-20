'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from './components/ProductCard';
import { ProductFilters } from './components/ProductFilters';
import { useProducts } from '@/lib/supabase/products';

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const productsApi = useProducts();

  const {
    data: products,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getProducts,
    // Use stale time of 5 minutes since products don't change often
    staleTime: 5 * 60 * 1000,
  });

  const filteredProducts = products
    ? activeCategory
      ? products.filter(product => product.category === activeCategory)
      : products
    : [];

  if (fetchError) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-red-500">
          Error loading products: {fetchError.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Browse Our Meals</h1>

          <div className="w-full md:w-auto flex items-center">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 mb-4 w-full"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <ProductFilters
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            showFilters={showFilters}
          />

          {/* Product Grid */}
          <div className="col-span-1 md:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No meals found</h3>
                <p className="text-muted-foreground mb-4">Try changing your filters</p>
                <Button variant="outline" onClick={() => setActiveCategory(null)}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;
