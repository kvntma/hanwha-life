export const dynamic = 'force-dynamic';

import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProduct, getProducts } from '@/lib/supabase/server/products';
import { Metadata } from 'next';
import { AddToCartButton } from '../components/AddToCartButton';
import { ProductCard } from '../components/ProductCard';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
    title: `${product.name} | Beast Tins`,
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
  const allProducts = await getProducts();

  if (!product) {
    notFound();
  }

  // Get similar products from the same category
  const similarProducts = allProducts
    .filter(p => p.id !== id && (p.category === product.category || p.featured))
    .slice(0, 4);

  return (
    <div className="container px-4 md:px-6 py-12 space-y-24 flex flex-col items-center max-w-full">
      <div className="w-full max-w-6xl">
        <Link
          href="/products"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Collection
        </Link>

        <div className="bg-card/50 backdrop-blur-md rounded-[2.5rem] border border-white/50 p-8 md:p-12 shadow-[0_0_120px_rgba(255,255,255,0.25)] overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 relative z-10 items-center">
            {/* Product Image with Smoke Emission */}
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border-4 border-white/20 bg-muted/30 flex items-center justify-center">
              {/* Smoke Layers Behind */}
              <div className="smoke-layer animate-smoke-emit w-[150%] h-[150%] -top-1/4 -left-1/4 opacity-40 z-0" />
              <div className="smoke-layer animate-smoke-emit w-[120%] h-[120%] -top-10 -left-10 opacity-30 z-0 [animation-delay:2s]" />
              <div className="smoke-layer animate-smoke-emit w-[180%] h-[180%] -top-1/2 -left-1/2 opacity-20 z-0 [animation-delay:4s]" />

              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover relative z-10"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <span className="bg-primary text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest italic tracking-tighter shadow-lg shadow-primary/20">
                  {product.category}
                </span>
                <h1 className="text-5xl md:text-6xl font-black mt-4 uppercase italic tracking-tighter leading-none">{product.name}</h1>
                <p className="text-xl text-muted-foreground mt-2 font-medium uppercase tracking-widest text-xs tracking-[0.2em]">{product.tagline}</p>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-5xl md:text-6xl font-black italic tracking-tighter text-primary">${product.price}</span>
                <span className="text-muted-foreground font-bold uppercase text-sm tracking-widest">{product.weight}</span>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>

              <div className="grid gap-4 p-8 bg-zinc-800/80 rounded-[1.5rem] border border-white/20 shadow-2xl">
                <div>
                  <h3 className="font-black uppercase italic tracking-tighter mb-4 border-b border-white/20 pb-2 text-primary text-lg">Tin Specifications</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl border border-white/10">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Nicotine Strength</span>
                      <span className="font-black italic text-foreground">{product.strength_mg} MG</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl border border-white/10">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Flavor Profile</span>
                      <span className="font-black italic text-foreground uppercase">{product.flavor_profile}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl border border-white/10">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Quantity</span>
                      <span className="font-bold">{product.weight}</span>
                    </div>
                  </div>
                </div>
              </div>

              {product.inventory_count > 0 && product.inventory_count < 10 && (
                <div className="bg-primary/10 border border-primary/20 rounded-[1.5rem] p-5 flex items-center gap-4 animate-pulse">
                  <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-xl">🔥</div>
                  <div>
                    <p className="font-black text-primary text-sm uppercase italic tracking-tighter">Selling Fast!</p>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Only {product.inventory_count} tins left. Secure your drop.</p>
                  </div>
                </div>
              )}

              {product.inventory_count === 0 && (
                <div className="bg-muted border border-border rounded-[1.5rem] p-5 flex items-center gap-4 opacity-60">
                  <div className="h-10 w-10 bg-muted-foreground/20 rounded-full flex items-center justify-center text-xl">🚫</div>
                  <div>
                    <p className="font-black text-muted-foreground text-sm uppercase italic tracking-tighter">Vault Empty</p>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Currently sold out. Return for future drops.</p>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <AddToCartButton productId={product.id} inventoryCount={product.inventory_count} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <section className="space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Similar <span className="text-primary">Drops</span></h2>
          <p className="text-muted-foreground max-w-2xl font-medium">Explore more premium nicotine delivery systems from the Beast Collection.</p>
          <div className="h-1.5 w-24 bg-primary rounded-full" />
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center w-full">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Link href="/products">
            <Button variant="outline" size="lg" className="rounded-full px-12 py-6 border-primary/50 text-white hover:bg-primary/10 font-bold uppercase italic tracking-tighter transition-all">
              View Full Collection
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
