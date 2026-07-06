'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useCart } from '@/components/providers/cart-provider';
import { Card, Typography } from '@/components/ui';
import { formatINR } from '@/constants/pricing';
import { routes } from '@/constants/routes';

export function CheckoutOrderSummary() {
  const { totals, coupon, shippingMethod } = useCart();

  return (
    <Card padding="md" className="space-y-4 lg:sticky lg:top-24">
      <Typography variant="h5" as="h2">
        Order Summary
      </Typography>

      <div className="max-h-64 space-y-3 overflow-y-auto">
        {totals.lineItems.map((item) => (
          <div key={item.productId} className="flex gap-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`${routes.products}/${item.slug}`}
                className="line-clamp-2 text-sm font-medium hover:underline"
              >
                {item.name}
              </Link>
              <Typography variant="caption" className="mt-0.5 block">
                Qty {item.quantity} × {formatINR(item.price)}
              </Typography>
            </div>
            <Typography variant="label" className="shrink-0 tabular-nums">
              {formatINR(item.lineTotal)}
            </Typography>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-border pt-4 text-sm">
        <Row label="Subtotal" value={formatINR(totals.subtotal)} />
        {coupon && <Row label={`Coupon (${coupon.code})`} value={`−${formatINR(totals.discount)}`} />}
        <Row
          label={`Shipping (${shippingMethod})`}
          value={totals.shipping === 0 ? 'Free' : formatINR(totals.shipping)}
        />
        <Row label="GST (5%)" value={formatINR(totals.tax)} />
        <div className="flex justify-between border-t border-border pt-3 font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{formatINR(totals.total)}</span>
        </div>
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
