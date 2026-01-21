import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Truck, ShieldCheck, Zap } from 'lucide-react';
import { FeaturedProducts } from './components/FeaturedProducts';

export default function Home() {
  return (
    <div className="space-y-8 w-full flex flex-col items-center">
      <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop"
            alt="Beast Tins Abstract Background"
            className="object-cover opacity-40"
            fill
            priority
            sizes="100vw"
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-background"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
          <Badge className="mb-4 bg-primary/20 text-white border border-primary/50 py-1.5 px-6 text-xs font-bold uppercase tracking-widest overflow-hidden relative">
            <span className="animate-smoke-drift relative z-10">Premium Drops Refined</span>
          </Badge>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black leading-tight tracking-tighter mb-4 text-white uppercase italic">
            <span className="animate-smoke">Beast</span> <span className="text-primary">Tins</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground max-w-xl mb-12 font-medium">
            Elevate your edge. Minimalist drops. High-octane strength.
            No compromises, just pure beast mode.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/products">
              <Button size="lg" className="rounded-full text-lg px-12 py-8 bg-primary hover:bg-tertiary transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,0,0,0.3)] animate-shine font-black uppercase italic tracking-tighter">
                Shop Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-4 uppercase italic">
              Why <span className="text-primary">Beast?</span>
            </h2>
            <div className="h-2 w-24 bg-primary rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-8 rounded-[2rem] bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.2),0_0_30px_rgba(255,255,255,0.05)] group">
              <div className="rounded-2xl bg-primary/10 p-5 mb-6 group-hover:bg-primary transition-colors">
                <Truck className="h-10 w-10 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 uppercase italic">Fast Delivery</h3>
              <p className="text-muted-foreground leading-relaxed">
                Same-day dispatch on all local orders. We get your tins to you before you even know you need them.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-[2rem] bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.2),0_0_30px_rgba(255,255,255,0.05)] group">
              <div className="rounded-2xl bg-primary/10 p-5 mb-6 group-hover:bg-primary transition-colors">
                <ShieldCheck className="h-10 w-10 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 uppercase italic">Discreet Shipping</h3>
              <p className="text-muted-foreground leading-relaxed">
                Plain packaging. No logos. Your business is your business. 100% confidential.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-[2rem] bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.2),0_0_30px_rgba(255,255,255,0.05)] group">
              <div className="rounded-2xl bg-primary/10 p-5 mb-6 group-hover:bg-primary transition-colors">
                <Zap className="h-10 w-10 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 uppercase italic">Premium Pure</h3>
              <p className="text-muted-foreground leading-relaxed">
                Zero fillers. Zero cap. Only the highest quality nicotine drops, curated for the elite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-20" />
        </div>
        <div className="container px-4 md:px-6 text-center relative z-10 mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase italic tracking-tighter">Enter the Beast Mode?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 opacity-90">
            Join the inner circle. Use code <span className="font-mono bg-white/20 px-2 py-1 rounded tracking-widest font-bold">BEAST24</span> for 15% off your first drop.
          </p>
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-12 py-8 text-xl font-black uppercase italic border-2 border-white text-white hover:bg-white hover:text-primary transition-all shadow-2xl"
            >
              Secure The Tins
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 flex flex-col items-center w-full">
        <div className="container px-4 md:px-6 w-full">
          <h2 className="text-3xl font-bold text-center mb-12">What The Homies Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                  JB
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Jake B.</h4>
                  <p className="text-sm text-muted-foreground">Fitness Coach</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Finally, a drop that doesn't taste like chemicals. My clients love the flavor profiles,
                and I love that they stay steady throughout their sessions."
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                  SR
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Sarah R.</h4>
                  <p className="text-sm text-muted-foreground">CrossFit Athlete</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Beast Tins has been a game-changer for my focus sessions. Clean strength,
                premium flavors, and I don't have to crash after a long day."
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                  MT
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Mike T.</h4>
                  <p className="text-sm text-muted-foreground">Weightlifter</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "No cap, these tins are fire. I've tried all the drop brands, and Beast
                Tins is the only one that hits different. Arctic Mint is my go-to."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
