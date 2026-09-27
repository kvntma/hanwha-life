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
  title: 'VialSupply | Premium Research Peptides',
  description:
    'The ultimate source for premium research peptides. VialSupply offers curated, high-purity compounds for scientific validation and laboratory excellence.',
  keywords:
    'research peptides, VialSupply, BPC-157, TB-500, Semaglutide, high purity, laboratory research',
  openGraph: {
    title: 'VialSupply | Premium Research Peptides',
    description:
      'The ultimate source for premium research peptides. VialSupply offers curated, high-purity compounds for scientific validation and laboratory excellence.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://pouchpal-store.lovable.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VialSupply Premium Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VialSupply | Premium Research Peptides',
    description:
      'The ultimate source for premium research peptides. VialSupply offers curated, high-purity compounds for scientific validation and laboratory excellence.',
    images: [
      'https://pouchpal-store.lovable.app/og-image.png',
    ],
  },
};

function isDynamicServerUsageError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    error.digest === 'DYNAMIC_SERVER_USAGE'
  );
}

// This makes the layout a Server Component
export default async function Layout({ children }: { children: React.ReactNode }) {
  // Fetch only featured products on the server
  const featuredProducts = await getFeaturedProducts().catch((error) => {
    if (isDynamicServerUsageError(error)) {
      throw error;
    }

    // biome-ignore lint/suspicious/noConsole: Server-side prefetch failures require diagnostic logging.
    console.error('Failed to prefetch featured products:', error);
    return undefined;
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <QueryProvider
              initialData={featuredProducts ? { featuredProducts } : undefined}
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
