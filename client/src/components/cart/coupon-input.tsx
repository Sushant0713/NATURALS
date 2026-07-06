'use client';

import { useState } from 'react';
import { Tag, X } from 'lucide-react';

import { useCart } from '@/components/providers/cart-provider';
import { Button, Icon, Input, Typography } from '@/components/ui';
import { storeCoupons } from '@/constants/cart';

export function CouponInput() {
  const { coupon, couponError, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');

  const handleApply = () => {
    if (applyCoupon(code)) {
      setCode('');
    }
  };

  return (
    <div className="space-y-3">
      <Typography variant="label" className="flex items-center gap-2">
        <Icon icon={Tag} size="sm" className="text-secondary" />
        Coupon Code
      </Typography>

      {coupon ? (
        <div className="flex items-center justify-between rounded-lg border border-success/30 bg-success/10 px-3 py-2">
          <Typography variant="body-sm" className="font-medium text-success">
            {coupon.code} applied (−{coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`})
          </Typography>
          <Button variant="ghost" size="icon-sm" onClick={removeCoupon} aria-label="Remove coupon">
            <Icon icon={X} size="sm" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="uppercase"
            aria-label="Coupon code"
          />
          <Button variant="outline" onClick={handleApply} disabled={!code.trim()}>
            Apply
          </Button>
        </div>
      )}

      {couponError && (
        <Typography variant="caption" className="text-destructive">
          {couponError}
        </Typography>
      )}

      <div className="space-y-1">
        {storeCoupons.map((c) => (
          <Typography key={c.code} variant="caption" className="block text-muted-foreground">
            <button
              type="button"
              className="font-medium text-secondary hover:underline"
              onClick={() => {
                setCode(c.code);
                applyCoupon(c.code);
              }}
            >
              {c.code}
            </button>
            {' — '}
            {c.description}
          </Typography>
        ))}
      </div>
    </div>
  );
}
