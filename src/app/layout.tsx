import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RootLayout } from '@/layouts/root/root-layout';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';
import { TooltipProvider } from '@/providers/tooltip-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js Template',
  description: 'A modern Next.js application template with Tailwind and shadcn/ui',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
