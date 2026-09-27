import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Target } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col space-y-24 py-12">
      <div className="max-w-7xl mx-auto w-full">
        {/* Brand Hero */}
        <section className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block bg-primary/10 border border-primary/20 px-4 py-1 rounded-full text-primary font-black uppercase italic tracking-tighter text-sm">
                The Protocol
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                Engineering <br />
                The <span className="text-primary italic">Perfect Vial.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                VialSupply isn't just a supplier. It's a high-performance research compound system designed for those who demand precision, purity, and zero compromises.
              </p>
              <Link href="/products">
                <Button size="lg" className="rounded-full px-12 py-8 text-xl bg-primary hover:bg-tertiary font-black uppercase italic tracking-tighter shadow-2xl shadow-primary/20 transition-all hover:scale-105 text-white">
                  Enter The Vault
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.1)] bg-zinc-900 flex items-center justify-center p-12">
                <Image
                  src="https://images.unsplash.com/photo-1576086213369-97a306dca665?q=80&w=2070&auto=format&fit=crop"
                  alt="VialSupply Elite Vial"
                  width={600}
                  height={600}
                  className="w-full h-auto object-contain hover:scale-110 transition-transform duration-700 rounded-2xl"
                  priority
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 blur-[100px] rounded-full" />
            </div>
          </div>
        </section>
      </div>

      {/* Industrial Specs - Full Width */}
      <section className="bg-zinc-900 border-y border-white/5 py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { val: '99.8%', label: 'HPLC Verifiable' },
              { val: '100%', label: 'Synthesized Pure' },
              { val: '0.0S', label: 'Lyophilized' },
              { val: 'DOMESTIC', label: 'Fast Shipping' }
            ].map((stat) => (
              <div key={stat.label} className="text-center space-y-2 group">
                <div className="text-4xl md:text-6xl font-black italic tracking-tighter text-primary group-hover:scale-110 transition-transform">{stat.val}</div>
                <div className="text-xs uppercase tracking-[0.3em] font-bold text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-4">
        {/* Philosophy */}
        <section className="container px-4 md:px-6 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Engineered for <span className="text-primary italic">Intensity.</span></h2>
              <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card/50 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/10 space-y-4">
                <Shield className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">The Secure Vault</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every vial is a sterile, vacuum-sealed environment. We use proprietary nitrogen flushing technology to ensure zero oxidation and maximum stability. When you reconstitute a VialSupply vial, you're experiencing the compound exactly as it was synthesized in the lab.
                </p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/10 space-y-4">
                <Target className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Precision Lyophilization</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We've optimized the freeze-drying matrix for instantaneous reconstitution. No waiting, no cloudiness—just immediate, clinical-grade peptide dissolution that performs exactly when your laboratory analysis requires.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Global CTA - Full Width */}
      <section className="relative overflow-hidden bg-primary py-24">
        <div className="absolute inset-0 opacity-10 animate-pulse bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="container px-4 text-center relative z-10 space-y-8 w-full md:px-6 mx-auto" >
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white">
            Secure Your <span className="text-black">Future Drop.</span>
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto font-bold uppercase tracking-widest text-sm">
            The collection is moving. Don't be left at the vault door.
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="rounded-full px-12 py-8 text-xl font-black uppercase italic tracking-tighter hover:scale-105 transition-transform bg-black text-white border-none">
              Shop The Collection
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
