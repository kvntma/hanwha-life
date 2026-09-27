'use client';

import { AuthModal } from '@/components/auth/auth-modal';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ResizableNavbar } from '@/components/velora/resizable-navbar';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useAuth } from '@/providers/auth-provider';
import { useCart } from '@/providers/cart-provider';
import { LogOut, Search, ShoppingCart, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isAdmin = useIsAdmin();
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Collection', href: '/products' },
    { label: 'The Vault', href: '/about' },
    { label: 'Contact', href: '/contact' },
    ...(isAdmin ? [{ label: 'Admin', href: '/admin' }] : []),
  ];

  return (
    <>
      <ResizableNavbar
        items={items}
        logo={
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tighter uppercase italic">
              <span className="animate-smoke text-foreground">Vial</span>
              <span className="text-primary italic">Supply</span>
            </span>
          </Link>
        }
        activeHref={pathname}
        cta={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10 hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Link href="/cart">
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-full border-primary/25 hover:bg-primary/10 hover:text-primary"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-xs w-5 h-5 flex items-center justify-center rounded-full text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-primary/10 hover:text-primary"
                  >
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="w-full">
                      My Orders
                    </Link>
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
        }
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
