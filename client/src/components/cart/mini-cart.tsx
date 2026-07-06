'use client';

import Link from 'next/link';
import { ShoppingBag, X } from 'lucide-react';

import { CartItemRow } from '@/components/cart/cart-item-row';
import { useAuth } from '@/components/providers/auth-provider';
import { useCart } from '@/components/providers/cart-provider';
import { Button, Icon, Typography } from '@/components/ui';
import { formatINR } from '@/constants/pricing';
import { routes } from '@/constants/routes';

export function MiniCart() {
  const { isMiniCartOpen, closeMiniCart, totals, isHydrated } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isMiniCartOpen) return null;

  const cartHref = isAuthenticated
    ? routes.cart
    : `${routes.login}?redirect=${encodeURIComponent(routes.cart)}`;

  return (
    <div className="fixed inset-0 z-[95]">
      <button
        type="button"
        className="absolute inset-0 bg-heritage/50 backdrop-blur-sm"
        aria-label="Close cart"
        onClick={closeMiniCart}
      />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface shadow-elevated">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Icon icon={ShoppingBag} size="md" className="text-secondary" />
            <Typography variant="h5" as="h2">
              Your Cart
            </Typography>
            {isHydrated && totals.itemCount > 0 && (
              <span className="rounded-full bg-secondary px-2 py-0.5 font-accent text-xs font-medium text-secondary-foreground">
                {totals.itemCount}
              </span>
            )}
          </div>
          <Button variant="ghost" size="icon-sm" onClick={closeMiniCart} aria-label="Close">
            <Icon icon={X} size="md" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!isHydrated ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : totals.lineItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon icon={ShoppingBag} size="xl" className="mb-4 text-muted-foreground/40" />
              <Typography variant="h6" as="p">
                Your cart is empty
              </Typography>
              <Typography variant="body-sm" className="mt-2 text-muted-foreground">
                Add some organic goodness to get started.
              </Typography>
              <Link href={routes.products} onClick={closeMiniCart}>
                <Button className="mt-6" variant="secondary">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {totals.lineItems.map((item) => (
                <CartItemRow key={item.productId} item={item} compact />
              ))}
            </div>
          )}
        </div>

        {isHydrated && totals.lineItems.length > 0 && (
          <div className="border-t border-border p-5">
            <div className="mb-4 flex justify-between">
              <Typography variant="label">Subtotal</Typography>
              <Typography variant="label" className="tabular-nums">
                {formatINR(totals.subtotal)}
              </Typography>
            </div>
            {!isAuthenticated && (
              <Typography variant="caption" className="mb-3 block text-center text-muted-foreground">
                Sign in to view your full cart with shipping &amp; coupons.
              </Typography>
            )}
            <Link href={cartHref} onClick={closeMiniCart}>
              <Button className="w-full" size="lg">
                {isAuthenticated ? 'View Cart' : 'Sign In to View Cart'}
              </Button>
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
