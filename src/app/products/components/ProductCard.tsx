'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Zap } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/providers/cart-provider';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };
  return (
    <div className="product-card flex flex-col h-full bg-card rounded-[1.5rem] border border-border overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.25),0_0_30px_rgba(255,255,255,0.1)] group">
      <Link href={`/products/${product.id}`} className="flex-grow">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={product.image || '/images/products/chicken-breast.png'}
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={90}
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full w-fit">
              {product.category}
            </span>
            {product.inventory_count > 0 && product.inventory_count < 10 && (
              <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse shadow-lg">
                🔥 SELLING FAST ({product.inventory_count} LEFT)
              </span>
            )}
            {product.inventory_count === 0 && (
              <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded-full">
                OUT OF STOCK
              </span>
            )}
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-black uppercase italic tracking-tighter text-xl">{product.name}</h3>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{product.tagline}</p>
            </div>
            <span className="font-black text-primary text-xl tracking-tighter italic">${product.price}</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <div className="flex items-center bg-muted px-2 py-1 rounded-full border border-border">
              {product.strength_mg} MG
            </div>
            <div className="flex items-center bg-muted px-2 py-1 rounded-full border border-border">
              {product.flavor_profile}
            </div>
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0 mt-auto">
        <Button
          className="w-full bg-primary hover:bg-tertiary text-white font-black uppercase italic tracking-tighter transition-all duration-300 hover:scale-[1.02] active:scale-95 animate-shine"
          onClick={handleAddToCart}
          disabled={product.inventory_count === 0}
        >
          {product.inventory_count === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4 fill-current animate-pulse" /> Secure Drop
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
