'use client';

import Link from 'next/link';
import { ArrowRight, Eye, Heart } from 'lucide-react';

import { useWishlist } from '@/hooks/use-wishlist';
import { Badge, Button, Card, CardContent, Icon, Typography } from '@/components/ui';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { categoryLabels } from '@/constants/categories';
import type { CatalogueProduct } from '@/constants/products';
import { routes } from '@/constants/routes';
import { imageSizes } from '@/lib/seo/image';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: CatalogueProduct;
  className?: string;
  onQuickView?: (product: CatalogueProduct) => void;
}

export function ProductCard({ product, className, onQuickView }: ProductCardProps) {
  const { isWishlisted, toggle, isHydrated } = useWishlist();
  const wishlisted = isHydrated && isWishlisted(product.id);

  return (
    <Card
      interactive
      padding="none"
      className={cn('group overflow-hidden', className)}
    >
      <div className="relative">
        <Link href={`${routes.products}/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-surface-muted">
            <OptimizedImage
              src={product.image}
              alt={product.name}
              fill
              sizes={imageSizes.productCard}
              className="object-cover transition-transform duration-slow group-hover:scale-105"
            />
            <div className="absolute left-2 top-2 flex flex-wrap gap-1 sm:left-3 sm:top-3 sm:gap-1.5">
              {product.isBestseller && (
                <Badge variant="warning" size="sm">
                  Bestseller
                </Badge>
              )}
              {product.isOrganic && (
                <Badge variant="success" size="sm">
                  Organic
                </Badge>
              )}
              {product.isGlutenFree && (
                <Badge variant="muted" size="sm">
                  Gluten Free
                </Badge>
              )}
            </div>
          </div>
        </Link>

        {/* Quick actions overlay */}
        <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-100 transition-opacity sm:bottom-3 sm:right-3 sm:opacity-0 sm:group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon-sm"
            className="size-8 shadow-card sm:size-9"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
            }}
          >
            <Icon
              icon={Heart}
              size="sm"
              className={cn(wishlisted && 'fill-current text-heritage')}
            />
          </Button>
          {onQuickView && (
            <Button
              variant="secondary"
              size="icon-sm"
              className="size-8 shadow-card sm:size-9"
              aria-label="Quick view"
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
            >
              <Icon icon={Eye} size="sm" />
            </Button>
          )}
        </div>
      </div>

      <CardContent className="space-y-2 p-3 sm:p-4">
        <Link href={`${routes.products}/${product.slug}`} className="block space-y-2">
          <Typography variant="caption" className="text-secondary">
            {categoryLabels[product.category]}
          </Typography>
          <Typography variant="h5" as="h3" className="line-clamp-2 text-sm sm:text-base">
            {product.name}
          </Typography>
          {product.ageGuidance && (
            <Badge variant="outline" size="sm">
              {product.ageGuidance}
            </Badge>
          )}
          <Typography variant="body-sm" className="line-clamp-2 text-muted-foreground">
            {product.shortDescription}
          </Typography>
          <span className="inline-flex items-center gap-1 pt-1 font-accent text-xs font-medium text-secondary transition-colors group-hover:text-primary sm:text-sm">
            View Product
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </CardContent>
    </Card>
  );
}
