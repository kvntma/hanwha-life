import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
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
