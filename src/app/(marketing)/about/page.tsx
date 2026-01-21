import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Zap, Target, Cpu } from 'lucide-react';

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
                The <span className="text-primary italic">Perfect Drop.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                Beast Tins isn't just a product. It's a high-performance nicotine delivery system designed for those who demand precision, intensity, and zero compromises.
              </p>
              <Link href="/products">
                <Button size="lg" className="rounded-full px-12 py-8 text-xl bg-primary hover:bg-tertiary font-black uppercase italic tracking-tighter shadow-2xl shadow-primary/20 transition-all hover:scale-105">
                  Enter The Vault
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.1)] bg-zinc-900 flex items-center justify-center p-12">
                <Image
                  src="https://pouchpal-store.lovable.app/assets/product-strong-DkOY5pmk.jpg"
                  alt="Beast Tins Elite Canister"
                  width={600}
                  height={600}
                  className="w-full h-auto object-contain hover:scale-110 transition-transform duration-700"
                  priority
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 blur-[100px] rounded-full"></div>
            </div>
          </div>
        </section>
      </div>

      {/* Industrial Specs - Full Width */}
      <section className="bg-zinc-900 border-y border-white/5 py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { val: '24MG', label: 'Max Strength' },
              { val: '100%', label: 'Synthetic Pure' },
              { val: '0.0S', label: 'Onset Delay' },
              { val: '12H', label: 'Sustained Flow' }
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-2 group">
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
              <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card/50 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/10 space-y-4">
                <Shield className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">The Secure Vault</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every tin is a sealed environment. We use proprietary multi-layered barrier technology to ensure zero flavor drift and maximum moisture retention. When you pop a Beast Tin, you're experiencing the drop exactly as it was engineered in the lab.
                </p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/10 space-y-4">
                <Target className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Precision Onset</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We've optimized the pH balance and carrier matrix for instantaneous absorption. No waiting, no buildup—just immediate, clinical-grade nicotine delivery that hits exactly when you need the focus.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founders / The Squad */}
        <section className="container px-4 md:px-6 pb-24">
          <div className="flex flex-col items-center gap-16">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">The <span className="text-primary italic">Squad.</span></h2>
              <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Forged in the fires of innovation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl">
              {[
                {
                  name: 'Myles Ma',
                  role: 'Systems Architect',
                  bio: 'The ghost in the machine. Ensuring the infrastructure never blinks.',
                  img: null,
                  placeholder: 'MM',
                  ghibli: false
                },
                {
                  name: 'Richard Bui',
                  role: 'Creative Director',
                  bio: 'Visionary artist bringing Studio Ghibli dreams to the Beast Tins universe.',
                  img: null,
                  placeholder: 'RB',
                  ghibli: true
                },
                {
                  name: 'NRP Danny',
                  role: 'Brand Strategist',
                  bio: 'The cultural architect. Blending heritage with high-performance aesthetics.',
                  img: null,
                  placeholder: 'NRP',
                  ghibli: true
                }
              ].map((member, i) => (
                <div key={i} className="group w-full space-y-6">
                  <div className="relative aspect-square rounded-full overflow-hidden border-4 border-white/10 group-hover:border-primary/50 transition-all duration-500 shadow-2xl">
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    {member.ghibli ? (
                      <div className="w-full h-full bg-gradient-to-br from-amber-200 via-orange-300 to-rose-300 flex items-center justify-center relative overflow-hidden">
                        {/* Studio Ghibli-inspired dreamy background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.5)_0%,_transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(255,200,150,0.4)_0%,_transparent_50%)]" />
                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-400/40 to-transparent" />
                        {/* Floating clouds effect */}
                        <div className="absolute top-10 left-10 w-20 h-8 bg-white/30 rounded-full blur-sm" />
                        <div className="absolute top-20 right-16 w-16 h-6 bg-white/20 rounded-full blur-sm" />
                        <div className="text-6xl font-black italic text-white/40 z-10 drop-shadow-2xl">{member.placeholder}</div>
                        <div className="absolute top-4 right-4 text-xs font-bold text-white/70 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
                          ✨ GHIBLI
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center text-5xl font-black italic text-white/20">
                        {member.placeholder}
                      </div>
                    )}
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-xl font-black uppercase italic tracking-tighter">{member.name}</div>
                    <div className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">{member.role}</div>
                    <p className="text-muted-foreground text-xs leading-relaxed pt-2 opacity-80">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Global CTA - Full Width */}
      <section className="relative overflow-hidden bg-primary py-24">
        <div className="absolute inset-0 opacity-10 animate-pulse bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
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
