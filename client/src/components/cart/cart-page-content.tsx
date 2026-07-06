'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

import { CartItemRow } from '@/components/cart/cart-item-row';
import { CartSummary } from '@/components/cart/cart-summary';
import { useCart } from '@/components/providers/cart-provider';
import { Button, Container, Icon, Typography } from '@/components/ui';
import { routes } from '@/constants/routes';

export function CartPageContent() {
  const { totals, isHydrated, clearCart } = useCart();

  if (!isHydrated) {
    return (
      <Container className="py-12">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-xl bg-muted" />
        </div>
      </Container>
    );
  }

  if (totals.lineItems.length === 0) {
    return (
      <Container className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <Icon icon={ShoppingBag} size="xl" className="mb-4 text-muted-foreground/40" />
        <Typography variant="h2" className="text-2xl sm:text-3xl">
          Your cart is empty
        </Typography>
        <Typography variant="lead" className="mt-3 max-w-md">
          Explore our range of organic and heritage foods — nature&apos;s bounty in every grain.
        </Typography>
        <Link href={routes.products}>
          <Button className="mt-8" size="lg">
            Shop Products
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Typography variant="overline">Shopping</Typography>
          <Typography variant="h1" className="mt-2 text-3xl sm:text-4xl">
            Your Cart
          </Typography>
          <Typography variant="body-sm" className="mt-2 text-muted-foreground">
            {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
          </Typography>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">
          Clear cart
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart items — card on mobile, list on desktop */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-surface">
            {/* Desktop table header */}
            <div className="hidden border-b border-border px-5 py-3 sm:grid sm:grid-cols-[1fr_auto] sm:gap-4">
              <Typography variant="caption" className="font-semibold uppercase tracking-wide">
                Product
              </Typography>
              <Typography variant="caption" className="font-semibold uppercase tracking-wide text-right">
                Total
              </Typography>
            </div>

            <div className="divide-y divide-border px-5">
              {totals.lineItems.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>
          </div>

          {/* Mobile-friendly product strip preview */}
          <div className="mt-6 flex gap-2 overflow-x-auto sm:hidden">
            {totals.lineItems.map((item) => (
              <div
                key={item.productId}
                className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border"
              >
                <Image src={item.image} alt="" fill className="object-cover" sizes="56px" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <CartSummary />
        </div>
      </div>
    </Container>
  );
}
