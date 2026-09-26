import { AuroraBackground } from '@/components/common/aurora-background';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Truck, Zap } from 'lucide-react';
import Link from 'next/link';
import { FeaturedProducts } from './components/FeaturedProducts';

export default function Home() {
  return (
    <div className="space-y-8 w-full flex flex-col items-center">
      <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <AuroraBackground />
        </div>

        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
          <Badge className="mb-4 bg-card/60 text-foreground border border-border/60 py-1.5 px-6 text-xs font-bold uppercase tracking-widest overflow-hidden relative backdrop-blur">
            <span className="animate-smoke-drift relative z-10">Premium Vials Refined</span>
          </Badge>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black leading-tight tracking-tighter mb-4 text-foreground uppercase italic">
            <span className="animate-smoke">Vial</span>
            <span className="text-primary">Supply</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground max-w-xl mb-12 font-medium">
            Accelerate your research. High-purity peptides. Superior stability. Engineered for peak
            laboratory performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/products">
              <Button
                size="lg"
                className="relative overflow-hidden rounded-full text-lg px-12 py-8 bg-primary hover:bg-tertiary transition-all hover:scale-105 shadow-[0_0_40px_rgba(59,130,246,0.3)] font-black uppercase italic tracking-tighter text-primary-foreground"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  Shop Collection
                </span>
                <span aria-hidden="true" className="motion-safe:shimmer-overlay absolute inset-0" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-4 uppercase italic">
              Why <span className="text-primary">VialSupply?</span>
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
                Same-day dispatch on all local orders. We get your vials to your lab before you even
                know you need them.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-[2rem] bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.2),0_0_30px_rgba(255,255,255,0.05)] group">
              <div className="rounded-2xl bg-primary/10 p-5 mb-6 group-hover:bg-primary transition-colors">
                <ShieldCheck className="h-10 w-10 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 uppercase italic">Discreet Shipping</h3>
              <p className="text-muted-foreground leading-relaxed">
                Plain packaging. No logos. Your business is your business. 100% confidential
                laboratory supply.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-[2rem] bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.2),0_0_30px_rgba(255,255,255,0.05)] group">
              <div className="rounded-2xl bg-primary/10 p-5 mb-6 group-hover:bg-primary transition-colors">
                <Zap className="h-10 w-10 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 uppercase italic">Premium Pure</h3>
              <p className="text-muted-foreground leading-relaxed">
                Zero fillers. Zero cap. Only the highest quality research peptides, synthesized for
                the elite.
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
          <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase italic tracking-tighter text-white">
            Accelerate Your Research?
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 opacity-90 text-white">
            Join the inner circle. Use code{' '}
            <span className="font-mono bg-white/20 px-2 py-1 rounded tracking-widest font-bold">
              VIAL24
            </span>{' '}
            for 15% off your first peptide order.
          </p>
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="relative overflow-hidden rounded-full px-12 py-8 text-xl font-black uppercase italic border-2 border-white text-white hover:bg-white hover:text-primary transition-all hover:scale-105 shadow-2xl"
            >
              <span className="relative z-10 inline-flex items-center gap-2">Secure The Vials</span>
              <span aria-hidden="true" className="motion-safe:shimmer-overlay absolute inset-0" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 flex flex-col items-center w-full">
        <div className="container px-4 md:px-6 w-full">
          <h2 className="text-3xl font-bold text-center mb-12">What Researchers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-white">
                  JB
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Dr. Jeffrey B.</h4>
                  <p className="text-sm text-muted-foreground">Biomedical Researcher</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Finally, a domestic source with verifiable purity. VialSupply is the only supplier
                we use now. Our assay consistency has improved dramatically."
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-white">
                  SR
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Sarah R.</h4>
                  <p className="text-sm text-muted-foreground">Lab Director</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "VialSupply has been a game-changer for our clinical research models. Pure
                composition, discreet shipping, and fast delivery."
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-white">
                  MT
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Michael T.</h4>
                  <p className="text-sm text-muted-foreground">Biochemist</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "No cap, these vials are top tier. I've run HPLC on multiple batches and they
                consistently hit 99.8%+ purity. BPC-157 is our primary compound."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
