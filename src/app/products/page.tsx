'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '@/lib/supabase/products';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';

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
  });

  const filteredProducts = products
    ? activeCategory
      ? products.filter(product => product.category === activeCategory)
      : products
    : [];

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
          {/* Filters - Side */}
          <div className={`md:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="sticky top-20 rounded-lg bg-card border border-border p-4">
              <h2 className="font-semibold text-lg mb-4">Filters</h2>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Category</h3>
                <div className="space-y-2">
                  <Button
                    variant={activeCategory === null ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveCategory(null)}
                  >
                    All Meals
                  </Button>
                  {/* Example categories, you may want to generate these dynamically */}
                  <Button
                    variant={activeCategory === 'Bestseller' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveCategory('Bestseller')}
                  >
                    Bestseller
                  </Button>
                  <Button
                    variant={activeCategory === 'Plant-Based' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveCategory('Plant-Based')}
                  >
                    Plant-Based
                  </Button>
                  <Button
                    variant={activeCategory === 'High Calorie' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveCategory('High Calorie')}
                  >
                    High Calorie
                  </Button>
                  <Button
                    variant={activeCategory === 'International' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveCategory('International')}
                  >
                    International
                  </Button>
                  <Button
                    variant={activeCategory === 'Keto' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveCategory('Keto')}
                  >
                    Keto
                  </Button>
                  <Button
                    variant={activeCategory === 'Spicy' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveCategory('Spicy')}
                  >
                    Spicy
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="col-span-1 md:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Spinner className="h-8 w-8" />
              </div>
            ) : fetchError ? (
              <div className="text-center py-12 text-red-500">
                Error loading products: {fetchError.message}
              </div>
            ) : filteredProducts.length === 0 ? (
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

const ProductCard = ({ product }: { product: any }) => {
  return (
    <div className="product-card flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="flex-grow">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || '/images/products/chicken-breast.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            fill
            priority
            sizes="100vw"
            quality={100}
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-muted-foreground text-sm">{product.tagline}</p>
            </div>
            <span className="font-bold text-primary">${product.price}</span>
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0 mt-auto">
        <Button className="w-full animate-sizzle button-hover-effect">
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductsPage;
