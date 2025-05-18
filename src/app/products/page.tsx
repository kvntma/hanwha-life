'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, ShoppingCart } from 'lucide-react';
import { products, Product } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';

const ProductsPage = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = activeFilter
    ? products.filter(product => product.proteinType === activeFilter)
    : products;

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
                <h3 className="font-medium mb-2">Protein Type</h3>
                <div className="space-y-2">
                  <Button
                    variant={activeFilter === null ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveFilter(null)}
                  >
                    All Meals
                  </Button>
                  <Button
                    variant={activeFilter === 'chicken' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveFilter('chicken')}
                  >
                    Chicken
                  </Button>
                  <Button
                    variant={activeFilter === 'beef' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveFilter('beef')}
                  >
                    Beef
                  </Button>
                  <Button
                    variant={activeFilter === 'plant' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveFilter('plant')}
                  >
                    Plant-Based
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="col-span-1 md:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No meals found</h3>
                <p className="text-muted-foreground mb-4">Try changing your filters</p>
                <Button variant="outline" onClick={() => setActiveFilter(null)}>
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

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="product-card flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="flex-grow">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
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
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="bg-secondary rounded-full px-2 py-1 mr-2">
              {product.nutrition.calories} cal
            </span>
            <span className="bg-secondary rounded-full px-2 py-1">
              {product.nutrition.protein}g protein
            </span>
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
