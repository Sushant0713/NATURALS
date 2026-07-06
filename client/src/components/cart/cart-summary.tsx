'use client';

import Link from 'next/link';

import { CouponInput } from '@/components/cart/coupon-input';
import { ShippingSelector } from '@/components/cart/shipping-selector';
import { useCart } from '@/components/providers/cart-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { Button, Card, Typography } from '@/components/ui';
import { formatINR } from '@/constants/pricing';
import { routes } from '@/constants/routes';

interface CartSummaryProps {
  showShipping?: boolean;
  showCheckout?: boolean;
}

export function CartSummary({ showShipping = true, showCheckout = true }: CartSummaryProps) {
  const { totals, coupon } = useCart();
  const { isAuthenticated } = useAuth();

  const checkoutHref = isAuthenticated
    ? routes.checkout
    : `${routes.login}?redirect=${encodeURIComponent(routes.checkout)}`;

  return (
    <Card padding="md" className="space-y-5 lg:sticky lg:top-24">
      <Typography variant="h5" as="h2">
        Order Summary
      </Typography>

      {showShipping && <ShippingSelector />}
      <CouponInput />

      <div className="space-y-2 border-t border-border pt-4 text-sm">
        <SummaryRow label="Subtotal" value={formatINR(totals.subtotal)} />
        {coupon && (
          <SummaryRow label="Coupon" value={`−${formatINR(totals.discount)}`} className="text-success" />
        )}
        <SummaryRow
          label="Shipping"
          value={totals.shipping === 0 ? 'Free' : formatINR(totals.shipping)}
        />
        <SummaryRow label="GST (5%)" value={formatINR(totals.tax)} />
        <div className="flex justify-between border-t border-border pt-3">
          <Typography variant="label">Total</Typography>
          <Typography variant="h5" as="span" className="tabular-nums">
            {formatINR(totals.total)}
          </Typography>
        </div>
      </div>

      {showCheckout && (
        <Link href={checkoutHref}>
          <Button className="w-full" size="lg" disabled={totals.itemCount === 0}>
            Proceed to Checkout
          </Button>
        </Link>
      )}

      <Link href={routes.products}>
        <Button variant="outline" className="w-full">
          Continue Shopping
        </Button>
      </Link>
    </Card>
  );
}

function SummaryRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex justify-between ${className ?? ''}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
