'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

import { useWishlist } from '@/hooks/use-wishlist';
import { Badge, Button, Icon, Modal, Typography } from '@/components/ui';
import { categoryLabels } from '@/constants/categories';
import type { CatalogueProduct } from '@/constants/products';
import { routes } from '@/constants/routes';
import { cn } from '@/lib/utils';

interface ProductQuickViewProps {
  product: CatalogueProduct | null;
  open: boolean;
  onClose: () => void;
}

export function ProductQuickView({ product, open, onClose }: ProductQuickViewProps) {
  const { isWishlisted, toggle, isHydrated } = useWishlist();

  if (!product) return null;

  const wishlisted = isHydrated && isWishlisted(product.id);

  return (
    <Modal open={open} onClose={onClose} className="sm:max-w-2xl">
      <div className="grid sm:grid-cols-2">
        <div className="relative aspect-square bg-surface-muted sm:aspect-auto sm:min-h-[320px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 400px"
          />
        </div>

        <div className="flex flex-col p-5 sm:p-6">
          <Typography variant="caption" className="text-secondary">
            {categoryLabels[product.category]}
          </Typography>
          <Typography variant="h4" as="h2" className="mt-1">
            {product.name}
          </Typography>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.isOrganic && <Badge variant="success">Organic</Badge>}
            {product.isGlutenFree && <Badge variant="muted">Gluten Free</Badge>}
            {product.isBestseller && <Badge variant="warning">Bestseller</Badge>}
            {product.ageGuidance && <Badge variant="outline">{product.ageGuidance}</Badge>}
          </div>

          <Typography variant="body-sm" className="mt-4 text-muted-foreground">
            {product.shortDescription}
          </Typography>

          <div className="mt-4 space-y-2">
            <Typography variant="label">Health Benefits</Typography>
            <ul className="space-y-1">
              {product.healthBenefits.slice(0, 3).map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
            <Link href={`${routes.products}/${product.slug}`} className="flex-1" onClick={onClose}>
              <Button variant="primary" className="w-full">
                View Full Details
              </Button>
            </Link>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => toggle(product.id)}
            >
              <Icon
                icon={Heart}
                size="sm"
                className={cn(wishlisted && 'fill-current text-heritage')}
              />
              {wishlisted ? 'Wishlisted' : 'Wishlist'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
