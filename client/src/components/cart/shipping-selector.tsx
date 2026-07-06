'use client';

import { Truck } from 'lucide-react';

import { useCart } from '@/components/providers/cart-provider';
import { Icon, Typography } from '@/components/ui';
import { FREE_SHIPPING_THRESHOLD, shippingOptions } from '@/constants/cart';
import { formatINR } from '@/constants/pricing';
import type { ShippingMethodId } from '@/constants/cart';
import { cn } from '@/lib/utils';

export function ShippingSelector() {
  const { shippingMethod, setShippingMethod, totals } = useCart();

  return (
    <div className="space-y-3">
      <Typography variant="label" className="flex items-center gap-2">
        <Icon icon={Truck} size="sm" className="text-secondary" />
        Shipping Method
      </Typography>

      <div className="space-y-2">
        {shippingOptions.map((option) => {
          const isSelected = shippingMethod === option.id;
          const isFree =
            option.freeAbove !== null &&
            totals.subtotal - totals.discount >= option.freeAbove;
          const price = isFree ? 0 : option.price;

          return (
            <label
              key={option.id}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40'
              )}
            >
              <input
                type="radio"
                name="shipping"
                checked={isSelected}
                onChange={() => setShippingMethod(option.id as ShippingMethodId)}
                className="mt-1 accent-primary"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <Typography variant="label" className="text-sm">
                    {option.label}
                  </Typography>
                  <Typography variant="label" className="tabular-nums">
                    {isFree ? (
                      <span className="text-success">Free</span>
                    ) : (
                      formatINR(price)
                    )}
                  </Typography>
                </div>
                <Typography variant="caption" className="mt-0.5 block">
                  {option.description}
                </Typography>
              </div>
            </label>
          );
        })}
      </div>

      {totals.subtotal - totals.discount < FREE_SHIPPING_THRESHOLD && (
        <Typography variant="caption" className="text-muted-foreground">
          Add {formatINR(FREE_SHIPPING_THRESHOLD - (totals.subtotal - totals.discount))} more for
          free standard shipping.
        </Typography>
      )}
    </div>
  );
}
