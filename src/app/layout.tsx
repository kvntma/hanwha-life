import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { RootLayout } from '@/layouts/root/root-layout';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';
import { TooltipProvider } from '@/providers/tooltip-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { getFeaturedProducts } from '@/lib/supabase/server/products';
import { CartProvider } from '@/providers/cart-provider';
import { ThemeProvider } from '@/providers/theme-provider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Beast Tins | Premium Nicotine Drops & Pouches',
  description:
    'The ultimate source for premium nicotine drops. Beast Tins offers curated, high-strength flavors for those who demand the best.',
  keywords:
    'nicotine drops, Beast Tins, premium pouches, black thunder, arctic mint, iridescent smoke',
  openGraph: {
    title: 'Beast Tins | Premium Nicotine Drops & Pouches',
    description:
      'The ultimate source for premium nicotine drops. Beast Tins offers curated, high-strength flavors for those who demand the best.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://pouchpal-store.lovable.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Beast Tins Premium Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beast Tins | Premium Nicotine Drops & Pouches',
    description:
      'The ultimate source for premium nicotine drops. Beast Tins offers curated, high-strength flavors for those who demand the best.',
    images: [
      'https://pouchpal-store.lovable.app/og-image.png',
    ],
  },
};

// This makes the layout a Server Component
export default async function Layout({ children }: { children: React.ReactNode }) {
  // Fetch only featured products on the server
  const featuredProducts = await getFeaturedProducts();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <QueryProvider
              initialData={{
                featuredProducts,
              }}
            >
              <TooltipProvider>
                <CartProvider>
                  <RootLayout>{children}</RootLayout>
                  <Toaster />
                </CartProvider>
              </TooltipProvider>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
