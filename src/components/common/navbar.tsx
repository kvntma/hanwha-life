import { Button } from '@/components/ui/button';
import { Menu, Search, ShoppingCart, X, UserCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { AuthModal } from '@/components/auth/auth-modal';
import { useIsAdmin } from '@/hooks/useIsAdmin';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isAdmin = useIsAdmin();

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-extrabold text-foreground">
            Bruh, <span className="text-primary">Chicken</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-foreground hover:text-primary transition-colors">
            Meals
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className=" text-red-500 font-medium hover:text-green-400 transition-colors"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/cart">
            <Button variant="outline" size="icon" className="rounded-full relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-xs w-5 h-5 flex items-center justify-center rounded-full">
                3
              </span>
            </Button>
          </Link>

          {/* Authentication */}
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Button
              variant="default"
              className="rounded-full gap-2"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <UserCircle className="h-5 w-5" />
              Sign In
            </Button>
          </SignedOut>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border p-4 z-50">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Meals
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
              </SignedOut>
              <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-full flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart (3)</span>
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};

export default Navbar;
