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

  const { data: products, error: fetchError } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getProducts,
    // Use stale time of 5 minutes since products don't change often
    staleTime: 5 * 60 * 1000,
  });

  const filteredProducts = products
    ? activeCategory
      ? products.filter(product => product.category === activeCategory && product.available)
      : products.filter(product => product.available)
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
    <div className="min-h-screen flex flex-col items-center w-full">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">The Drop <span className="text-primary">Collection</span></h1>

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
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">No drops found</h3>
                <p className="text-muted-foreground mb-4 font-medium uppercase text-xs tracking-widest">The vault is empty. Try a different line.</p>
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
      </div>
    </div>
  );
};

export default ProductsPage;
