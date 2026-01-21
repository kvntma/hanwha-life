'use client';

import { Button } from '@/components/ui/button';
import { Menu, Search, ShoppingCart, X, UserCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { AuthModal } from '@/components/auth/auth-modal';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useAuth } from '@/providers/auth-provider';
import { useCart } from '@/providers/cart-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isAdmin = useIsAdmin();
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="w-full h-16 px-4 md:px-12 flex items-center">
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tighter uppercase italic">
              <span className="animate-smoke dark:text-white text-black">Beast</span> <span className="text-primary italic">Tins</span>
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 flex-none">
          <Link href="/" className="text-foreground hover:text-tertiary transition-colors font-bold uppercase text-[10px] tracking-widest">
            Home
          </Link>
          <Link href="/products" className="text-foreground hover:text-tertiary transition-colors font-bold uppercase text-[10px] tracking-widest">
            Collection
          </Link>
          <Link href="/about" className="text-foreground hover:text-tertiary transition-colors font-bold uppercase text-[10px] tracking-widest">
            The Vault
          </Link>
          <Link href="/contact" className="text-foreground hover:text-tertiary transition-colors font-bold uppercase text-[10px] tracking-widest">
            Contact
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-primary font-black uppercase italic tracking-tighter hover:text-tertiary transition-colors"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Right: Desktop Actions */}
        <div className="flex-1 hidden md:flex items-center justify-end gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <Link href="/cart">
            <Button variant="outline" size="icon" className="rounded-full relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-xs w-5 h-5 flex items-center justify-center rounded-full text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Authentication */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="w-full">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              className="rounded-full gap-2 bg-primary hover:bg-tertiary font-black uppercase italic tracking-tighter px-6"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <UserCircle className="h-5 w-5" />
              Sign In
            </Button>
          )}
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
              className="text-foreground hover:text-tertiary transition-colors py-2 font-bold uppercase text-xs tracking-widest"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-foreground hover:text-tertiary transition-colors py-2 font-bold uppercase text-xs tracking-widest"
              onClick={() => setIsMenuOpen(false)}
            >
              Collection
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-tertiary transition-colors py-2 font-bold uppercase text-xs tracking-widest"
              onClick={() => setIsMenuOpen(false)}
            >
              The Vault
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-tertiary transition-colors py-2 font-bold uppercase text-xs tracking-widest"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/orders"
              className="text-foreground hover:text-tertiary transition-colors py-2 font-bold uppercase text-xs tracking-widest"
              onClick={() => setIsMenuOpen(false)}
            >
              My Orders
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-primary font-black italic uppercase tracking-tighter hover:text-tertiary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                {user ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full gap-2"
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                ) : (
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
                )}
                <ThemeToggle />
              </div>
              <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-full flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart ({itemCount})</span>
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
