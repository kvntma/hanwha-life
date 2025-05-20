export const dynamic = 'force-dynamic';

import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProduct } from '@/lib/supabase/server/products';
import { Metadata } from 'next';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | Bruh, Chicken`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <Link
        href="/products"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-4xl font-bold mt-4">{product.name}</h1>
            <p className="text-xl text-muted-foreground mt-2">{product.tagline}</p>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold">${product.price}</span>
            <span className="text-muted-foreground">{product.weight}</span>
          </div>

          <p className="text-lg">{product.description}</p>

          <div className="grid gap-4 p-6 bg-card rounded-lg">
            <div>
              <h3 className="font-semibold mb-2">Nutrition Facts</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Calories</span>
                  <span className="font-medium">{product.nutrition.calories}</span>
                </div>
                <div className="flex justify-between">
                  <span>Protein</span>
                  <span className="font-medium">{product.nutrition.protein}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Carbs</span>
                  <span className="font-medium">{product.nutrition.carbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Fat</span>
                  <span className="font-medium">{product.nutrition.fat}g</span>
                </div>
              </div>{' '}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Weight</span>
                  <span className="font-medium">{product.weight}</span>
                </div>
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
