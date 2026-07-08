'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Phone, Search, ShoppingCart, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { MiniCart } from '@/components/cart/mini-cart';
import { useAuth } from '@/components/providers/auth-provider';
import { useCart } from '@/components/providers/cart-provider';
import { Button, buttonVariants, Container, Icon } from '@/components/ui';
import { brand } from '@/constants/brand';
import { routes } from '@/constants/routes';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', href: routes.home },
  { label: 'Our Story', href: '#our-story' },
  { label: 'Contact', href: `tel:${brand.contactPhone}` },
];

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { totals, isHydrated } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setIsSearchOpen(false);
    setIsMobileOpen(false);
    router.push(q ? `${routes.products}?q=${encodeURIComponent(q)}` : routes.products);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-normal backdrop-blur-md',
        isScrolled
          ? 'border-b border-white/10 bg-white/15 dark:bg-black/20 shadow-sm'
          : 'border-b border-transparent bg-white/5 dark:bg-black/10'
      )}
    >
      {/* Logo separated and absolute positioned at the top left corner */}
      <Link href={routes.home} className="absolute left-1 sm:left-2 lg:left-2 -top-2 z-50 flex items-center">
        <Image
          src="/logo-clean.png"
          alt={brand.name}
          width={280}
          height={112}
          className="h-20 lg:h-24 w-auto object-contain"
          placeholder="empty"
          style={{ background: 'none' }}
          priority
        />
      </Link>

      <Container>
        <div className="flex h-16 items-center justify-between gap-4 lg:h-18">
          {/* Spacer to push menu items right and prevent logo overlap */}
          <div className="mr-auto w-40 sm:w-56 lg:w-72 shrink-0" />

          <nav className="hidden items-center gap-1 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 font-accent text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              className="hidden sm:inline-flex"
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <Icon icon={Search} size="md" />
            </Button>
            <Link href={isAuthenticated ? routes.account.profile : routes.login}>
              <Button variant="ghost" size="icon-sm" className="hidden sm:inline-flex" aria-label="Account">
                <Icon icon={User} size="md" />
              </Button>
            </Link>
            <Link
              href={routes.cart}
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'relative')}
              aria-label="Cart"
            >
              <Icon icon={ShoppingCart} size="md" />
              {isHydrated && totals.itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-secondary font-accent text-[10px] font-bold text-secondary-foreground">
                  {totals.itemCount > 9 ? '9+' : totals.itemCount}
                </span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              className="xl:hidden"
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMobileOpen((v) => !v)}
            >
              <Icon icon={isMobileOpen ? X : Menu} size="md" />
            </Button>
            <a
              href={`tel:${brand.contactPhone}`}
              className={cn(
                'ml-1 hidden items-center gap-2 md:inline-flex',
                'inline-flex h-8 rounded-button bg-secondary px-3 font-accent text-xs font-medium text-secondary-foreground shadow-sm transition-all hover:bg-secondary/90'
              )}
            >
              <Icon icon={Phone} size="sm" />
              Order
            </a>
          </div>
        </div>
      </Container>

      {isSearchOpen && (
        <div className="border-t border-border bg-surface">
          <Container className="py-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="h-10 flex-1 rounded-lg border border-border bg-surface px-3 font-accent text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Search products"
              />
              <Button type="submit" size="sm">
                Search
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Close search"
                onClick={() => setIsSearchOpen(false)}
              >
                <Icon icon={X} size="md" />
              </Button>
            </form>
          </Container>
        </div>
      )}

      {isMobileOpen && (
        <div className="border-t border-border bg-surface xl:hidden">
          <Container className="py-4">
            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="h-10 flex-1 rounded-lg border border-border bg-surface px-3 font-accent text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Search products"
              />
              <Button type="submit" size="icon-sm" aria-label="Search">
                <Icon icon={Search} size="sm" />
              </Button>
            </form>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 font-accent text-sm font-medium hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`tel:${brand.contactPhone}`}
                className="mt-2 flex items-center gap-2 rounded-lg bg-secondary px-3 py-2.5 font-accent text-sm font-medium text-secondary-foreground"
              >
                <Icon icon={Phone} size="sm" />
                Call {brand.contactPhone}
              </a>
            </nav>
          </Container>
        </div>
      )}
      <MiniCart />
    </header>
  );
}
