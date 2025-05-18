import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-sm uppercase tracking-wider text-primary mb-2">ABOUT US</h2>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Fueling fitness <br />
                through the power <br />
                of real food.
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Bruh, Chicken is more than meal prep — it's a movement. We're changing how fitness
                enthusiasts approach nutrition with chef-crafted, macro-perfect meals that actually
                taste good. No cap.
              </p>
              <Link href="/products">
                <Button size="lg" className="rounded-full px-8">
                  Shop Our Meals
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="rounded-full overflow-hidden border-4 border-primary relative z-10">
                <Image
                  src="/images/products/chicken-breast.png"
                  alt="Chef preparing meals"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover aspect-square"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-3/4 h-3/4 bg-muted rounded-full z-9"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-secondary rounded-lg">
                  <h3 className="text-3xl font-bold text-primary">45g</h3>
                  <p className="text-sm text-muted-foreground">Average protein per meal</p>
                </div>
                <div className="p-6 bg-secondary rounded-lg">
                  <h3 className="text-3xl font-bold text-primary">24h</h3>
                  <p className="text-sm text-muted-foreground">Fresh-to-door delivery</p>
                </div>
                <div className="p-6 bg-secondary rounded-lg">
                  <h3 className="text-3xl font-bold text-primary">100%</h3>
                  <p className="text-sm text-muted-foreground">Chef-crafted recipes</p>
                </div>
                <div className="p-6 bg-secondary rounded-lg">
                  <h3 className="text-3xl font-bold text-primary">0</h3>
                  <p className="text-sm text-muted-foreground">Artificial ingredients</p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-4">
                We're not your average meal prep company. At Bruh, Chicken., we believe clean eating
                doesn't have to be bland, boring, or break the bank.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Born out of late-night gym sessions, macros tracking obsession, and a shared love
                for ridiculously juicy chicken, we're here to fuel your grind with meals that slap
                harder than your post-workout pump. No Cap.
              </p>
              <Link href="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  See Our Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-lg font-bold mb-2">Ready in Minutes</h3>
              <p className="text-muted-foreground">No prep, no stress - just heat and eat.</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="text-4xl mb-4">🥩</div>
              <h3 className="text-lg font-bold mb-2">Loaded with Flavor</h3>
              <p className="text-muted-foreground">Not just salt and sadness - real taste.</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="text-4xl mb-4">🥦</div>
              <h3 className="text-lg font-bold mb-2">Macro-Friendly</h3>
              <p className="text-muted-foreground">Tracked so you don't have to.</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="text-4xl mb-4">🥗</div>
              <h3 className="text-lg font-bold mb-2">Clean AF</h3>
              <p className="text-muted-foreground">No junk, no fluff, just gains.</p>
            </div>
          </div>
          <p className="text-center text-lg text-muted-foreground mt-8">
            Whether you're bulking, cutting, or just tryna eat like a grown adult, we gotchu.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Meet The Team</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <div className="bg-card p-6 rounded-lg border border-border max-w-sm w-full">
              <div className="rounded-full overflow-hidden mb-4 aspect-square relative">
                <Image
                  src="/images/products/ceo-patrick.png"
                  alt="Patrick Nguyen"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 384px"
                  priority
                />
              </div>
              <h3 className="text-lg font-bold">Patrick Nguyen</h3>
              <p className="text-primary text-sm mb-2">Founder, CEO, and Head Chef</p>
              <p className="text-muted-foreground text-sm">
                Former body builder with a passion for nutrition and helping others reach their
                fitness goals.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border max-w-sm w-full">
              <div className="rounded-full overflow-hidden mb-4 aspect-square relative">
                <Image
                  src="/images/products/myles.png"
                  alt="Myles Ma"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              </div>
              <h3 className="text-lg font-bold">Myles Ma</h3>
              <p className="text-primary text-sm mb-2">Code Monkey</p>
              <p className="text-muted-foreground text-sm">Bruh.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Fuel Your Fitness Journey?
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join thousands of fitness enthusiasts who trust Bruh, Chicken for their nutrition needs.
          </p>
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Browse Our Meals
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
