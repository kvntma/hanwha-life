import { CtaNewsletter } from '@/components/blocks/cta-newsletter';
import { Badge } from '@/components/ui/badge';
import { AnimatedGradientText } from '@/components/velora/animated-gradient-text';
import { BlurFade } from '@/components/velora/blur-fade';
import { FlipWords } from '@/components/velora/flip-words';
import { RetroGrid } from '@/components/velora/retro-grid';
import { ShimmerButton } from '@/components/velora/shimmer-button';
import { SpotlightCard } from '@/components/velora/spotlight-card';
import { TextHighlighter } from '@/components/velora/text-highlighter';
import { TextReveal } from '@/components/velora/text-reveal';
import { WavyBackground } from '@/components/velora/wavy-background';
import { WobbleCard } from '@/components/velora/wobble-card';
import { ShieldCheck, Truck, Zap } from 'lucide-react';
import Link from 'next/link';
import { FeaturedProducts } from './components/FeaturedProducts';

export default function Home() {
  return (
    <div className="space-y-10 w-full flex flex-col items-center">
      <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-background">
        <WavyBackground
          waves={5}
          blur={20}
          opacity={0.35}
          colors={['--primary', '--tertiary']}
          className="z-0 top-1/3"
        />
        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
          <Badge className="mb-4 bg-card/60 text-foreground border border-border/60 py-1.5 px-6 text-xs font-bold uppercase tracking-widest overflow-hidden relative backdrop-blur">
            <span className="animate-smoke-drift relative z-10">Premium Peptides Refined</span>
          </Badge>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black leading-tight tracking-tighter mb-4 text-foreground uppercase italic">
            <AnimatedGradientText solid className="animate-smoke">
              Vial
            </AnimatedGradientText>
            <span className="text-primary">Supply</span>
          </h1>
          <h2 className="flex items-center justify-center gap-3 text-3xl md:text-6xl font-black leading-tight tracking-tighter text-foreground mb-12">
            <span>Fuel Your </span>
            <FlipWords className="text-primary" duration={1000} words={['Research', 'Body', 'Future']} />
          </h2>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/products">
              <ShimmerButton className="h-auto px-12 py-6 text-lg font-black uppercase italic tracking-tighter hover:bg-tertiary shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                Shop Collection
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-18 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center mb-16">
            <BlurFade delay={0.4} className="max-w-2xl text-center">
              <h2 className="text-4xl md:text-5xl font-black text-center mb-4 uppercase italic">
                Why <span className="text-primary">Choose Us?</span>
              </h2>
              <div className="mx-auto mb-6 h-2 w-4/5 rounded-full bg-primary" />
              <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                Zero food noise, zero shipping noise : we{' '}
                <TextHighlighter color="color-mix(in oklab, var(--primary) 28%, transparent)">
                  silence both.
                </TextHighlighter>
              </p>
            </BlurFade>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <SpotlightCard
              className="flex flex-col items-center text-center p-8 md:py-14 md:px-10 rounded-[2rem] hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.2),0_0_30px_rgba(255,255,255,0.05)] group"
              color="color-mix(in oklab, var(--primary) 16%, transparent)"
            >
              <div className="flex flex-row items-center w-full rounded-2xl bg-primary/10 p-5 md:py-6 md:px-6 mb-8 group-hover:bg-primary transition-colors">
                <Truck className="h-10 w-10 text-primary group-hover:text-white shrink-0" />
                <h3 className="flex-1 text-center text-2xl font-bold uppercase italic group-hover:text-white transition-colors">Fast Delivery</h3>
                <div className="w-10 shrink-0" aria-hidden="true" />
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Same-day dispatch on all local orders. We get your vials to your lab before you even
                know you need them.
              </p>
            </SpotlightCard>

            <SpotlightCard
              className="flex flex-col items-center text-center p-8 md:py-14 md:px-10 rounded-[2rem] hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.2),0_0_30px_rgba(255,255,255,0.05)] group"
              color="color-mix(in oklab, var(--primary) 16%, transparent)"
            >
              <div className="flex flex-row items-center w-full rounded-2xl bg-primary/10 p-5 md:py-6 md:px-6 mb-8 group-hover:bg-primary transition-colors">
                <ShieldCheck className="h-10 w-10 text-primary group-hover:text-white shrink-0" />
                <h3 className="flex-1 text-center text-2xl font-bold uppercase italic group-hover:text-white transition-colors">Discreet Shipping</h3>
                <div className="w-10 shrink-0" aria-hidden="true" />
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Plain packaging. No logos. Your business is your business. 100% confidential
                laboratory supply.
              </p>
            </SpotlightCard>

            <SpotlightCard
              className="flex flex-col items-center text-center p-8 md:py-14 md:px-10 rounded-[2rem] hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.2),0_0_30px_rgba(255,255,255,0.05)] group"
              color="color-mix(in oklab, var(--primary) 16%, transparent)"
            >
              <div className="flex flex-row items-center w-full rounded-2xl bg-primary/10 p-5 md:py-6 md:px-6 mb-8 group-hover:bg-primary transition-colors">
                <Zap className="h-10 w-10 text-primary group-hover:text-white shrink-0" />
                <h3 className="flex-1 text-center text-2xl font-bold uppercase italic group-hover:text-white transition-colors">Premium Pure</h3>
                <div className="w-10 shrink-0" aria-hidden="true" />
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Zero fillers. Zero cap. Only the highest quality research peptides, synthesized for
                the elite.
              </p>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      <CtaNewsletter />

      {/* Testimonials */}
      <section className="relative flex w-full flex-col items-center overflow-hidden bg-background py-32 md:py-40">
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/4">
          <RetroGrid angle={65} cellSize={48} opacity={0.9} />
        </div>
        <div className="container relative z-10 w-full px-4 md:px-6">
          <TextReveal
            as="h2"
            text="What People Say About Our Products"
            className="mb-12 block text-center text-3xl font-black uppercase italic tracking-tighter md:text-5xl"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WobbleCard
              className="border border-primary/15 bg-white text-slate-950 shadow-lg shadow-primary/5"
              contentClassName="p-6 [&_.text-muted-foreground]:text-slate-600"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
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
            </WobbleCard>

            <WobbleCard
              className="border border-primary/15 bg-white text-slate-950 shadow-lg shadow-primary/5"
              contentClassName="p-6 [&_.text-muted-foreground]:text-slate-600"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
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
            </WobbleCard>

            <WobbleCard
              className="border border-primary/15 bg-white text-slate-950 shadow-lg shadow-primary/5"
              contentClassName="p-6 [&_.text-muted-foreground]:text-slate-600"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
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
            </WobbleCard>

          </div>
        </div>
      </section>
    </div>
  );
}
