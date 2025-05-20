import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RootLayout } from '@/layouts/root/root-layout';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';
import { TooltipProvider } from '@/providers/tooltip-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bruh, Chicken',
  description: 'Premium meal prep for the gains you deserve.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <QueryProvider>
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
