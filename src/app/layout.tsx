import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RootLayout } from '@/layouts/root/root-layout';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';
import { TooltipProvider } from '@/providers/tooltip-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { getFeaturedProducts } from '@/lib/supabase/server/products';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bruh, Chicken | Premium Meal Prep for Fitness Goals',
  description:
    'Premium meal prep service offering chef-crafted, macro-perfect meals. Perfect for fitness enthusiasts, athletes, and anyone looking for healthy, convenient meals.',
  keywords:
    'meal prep, fitness meals, healthy food delivery, macro meals, protein meals, meal delivery service',
  openGraph: {
    title: 'Bruh, Chicken | Premium Meal Prep for Fitness Goals',
    description:
      'Premium meal prep service offering chef-crafted, macro-perfect meals. Perfect for fitness enthusiasts, athletes, and anyone looking for healthy, convenient meals.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=2069&auto=format&fit=crop',
        width: 2069,
        height: 1379,
        alt: 'Premium grilled chicken meal prep',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bruh, Chicken | Premium Meal Prep for Fitness Goals',
    description:
      'Premium meal prep service offering chef-crafted, macro-perfect meals. Perfect for fitness enthusiasts, athletes, and anyone looking for healthy, convenient meals.',
    images: [
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=2069&auto=format&fit=crop',
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification', // Add your Google Search Console verification code
  },
};

// This makes the layout a Server Component
export default async function Layout({ children }: { children: React.ReactNode }) {
  // Fetch only featured products on the server
  const featuredProducts = await getFeaturedProducts();

  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <QueryProvider
            initialData={{
              featuredProducts,
            }}
          >
            <TooltipProvider>
              <RootLayout>{children}</RootLayout>
              <Toaster />
            </TooltipProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
