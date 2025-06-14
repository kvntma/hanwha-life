import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import DebugToken from '@/components/common/debug-token';
import { FeaturedProducts } from './components/FeaturedProducts';

export default function Home() {
  return (
    <div className="space-y-8 w-full flex flex-col items-center">
      <section className="relative h-[60vh] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=2069&auto=format&fit=crop"
            alt="Grilled chicken"
            className="object-cover"
            fill
            priority
            sizes="100vw"
            quality={100}
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter mb-4 text-white">
            Fuel Up. <span className="text-primary">No Cap.</span>
          </h1>
          <DebugToken />
          <p className="text-xl md:text-2xl text-gray-200 max-w-md md:max-w-lg mb-8">
            Premium meal prep for the gains you deserve. Chef-crafted, macro-perfect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products">
              <Button size="lg" className="rounded-full text-lg px-8">
                Shop Meals
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full text-lg px-8 text-white border-white hover:bg-white hover:text-black"
              >
                See What's Cooking
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why <span className="text-primary">Bruh, Chicken?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-secondary">
              <div className="rounded-full bg-primary p-4 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-background"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Macro Perfection</h3>
              <p className="text-muted-foreground">
                Precisely calculated macros to support your fitness goals, whether bulking, cutting,
                or maintaining.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-secondary">
              <div className="rounded-full bg-primary p-4 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-background"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Time Saver</h3>
              <p className="text-muted-foreground">
                Skip the meal prep hassle. More time for gains, less time cooking and cleaning.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-secondary">
              <div className="rounded-full bg-primary p-4 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-background"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Actually Tastes Good</h3>
              <p className="text-muted-foreground">
                Chef-crafted meals that make you forget you're eating "healthy food."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground w-full">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Fuel Your Gains?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            First-time customers get 10% off their order with code: NOCHEATMEAL
          </p>
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Order Now
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
                "Finally, meal prep that doesn't taste like cardboard. My clients love the macros,
                and I love that they stay consistent with their nutrition."
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
                "Bruh, Chicken has been a game-changer for my competition prep. High protein, tasty
                meals, and I don't have to think about cooking after training."
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
                "No cap, these meals are fire. I've tried all the meal prep companies, and Bruh,
                Chicken is the only one that hits different. The Shredder is my go-to."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
