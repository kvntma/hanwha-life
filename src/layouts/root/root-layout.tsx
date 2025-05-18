'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/providers/theme-provider';
import { Home, Info, Settings } from 'lucide-react';
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="theme"
    >
      <div className="min-h-screen w-full bg-background">
        <Navbar />
        <div className="min-w-full">
          <main className="py-6">{children}</main>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
