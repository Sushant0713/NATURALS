'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

import { QuantitySelector } from '@/components/product/quantity-selector';
import { useCart } from '@/components/providers/cart-provider';
import { Button, Icon, Typography } from '@/components/ui';
import { formatINR } from '@/constants/pricing';
import { routes } from '@/constants/routes';
import type { CartLineItem } from '@/lib/cart/types';

interface CartItemRowProps {
  item: CartLineItem;
  compact?: boolean;
}

export function CartItemRow({ item, compact = false }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className={`flex gap-3 sm:gap-4 ${compact ? '' : 'border-b border-border py-4 last:border-0'}`}>
      <Link
        href={`${routes.products}/${item.slug}`}
        className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted sm:size-20"
      >
        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`${routes.products}/${item.slug}`} className="min-w-0 hover:underline">
            <Typography variant="label" className="line-clamp-2 text-sm sm:text-base">
              {item.name}
            </Typography>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            aria-label="Remove item"
            onClick={() => removeItem(item.productId)}
          >
            <Icon icon={Trash2} size="sm" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <QuantitySelector
            value={item.quantity}
            onChange={(q) => updateQuantity(item.productId, q)}
            className="scale-90 origin-left sm:scale-100"
          />
          <Typography variant="label" className="tabular-nums">
            {formatINR(item.lineTotal)}
          </Typography>
        </div>

        {!compact && (
          <Typography variant="caption" className="text-muted-foreground">
            {formatINR(item.price)} each
          </Typography>
        )}
      </div>
    </div>
  );
}
