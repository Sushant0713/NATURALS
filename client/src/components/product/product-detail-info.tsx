'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Phone, Share2, ShoppingBag } from 'lucide-react';

import { useCart } from '@/components/providers/cart-provider';
import { QuantitySelector } from '@/components/product/quantity-selector';
import { useShare } from '@/hooks/use-share';
import { useWishlist } from '@/hooks/use-wishlist';
import { Badge, Button, Icon, Typography } from '@/components/ui';
import { brand } from '@/constants/brand';
import { categoryLabels } from '@/constants/categories';
import { formatINR, getProductPrice } from '@/constants/pricing';
import { routes } from '@/constants/routes';
import type { ProductDetail } from '@/lib/products/product-detail-types';
import { cn } from '@/lib/utils';
import { StarRating } from '@/components/product/star-rating';

interface ProductDetailInfoProps {
  product: ProductDetail;
}

export function ProductDetailInfo({ product }: ProductDetailInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { isWishlisted, toggle, isHydrated } = useWishlist();
  const { share, copied } = useShare();

  const price = getProductPrice(product.id);
  const wishlisted = isHydrated && isWishlisted(product.id);
  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${routes.products}/${product.slug}`
      : `${routes.products}/${product.slug}`;

  return (
    <div className="space-y-5">
      <div>
        <Link
          href={`${routes.categories}/${product.category}`}
          className="font-accent text-sm font-medium text-secondary hover:underline"
        >
          {categoryLabels[product.category]}
        </Link>
        <Typography variant="h1" className="mt-2 text-2xl sm:text-3xl lg:text-4xl">
          {product.name}
        </Typography>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <StarRating rating={product.averageRating} size="md" />
          <Typography variant="caption">
            {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
          </Typography>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {product.isBestseller && <Badge variant="warning">Bestseller</Badge>}
        {product.isOrganic && <Badge variant="success">Organic</Badge>}
        {product.isGlutenFree && <Badge variant="muted">Gluten Free</Badge>}
        {product.ageGuidance && <Badge variant="outline">{product.ageGuidance}</Badge>}
      </div>

      <Typography variant="lead" className="text-base sm:text-lg">
        {product.shortDescription}
      </Typography>

      {price > 0 && (
        <Typography variant="h3" className="text-secondary">
          {formatINR(price)}
        </Typography>
      )}

      <Typography variant="body-sm" className="text-muted-foreground">
        Traditionally hand-crafted by rural women. Chemical-free — no artificial preservatives,
        colours, or flavours.
      </Typography>

      <div className="flex flex-wrap items-center gap-4 border-y border-border py-5">
        <div className="space-y-1.5">
          <Typography variant="label">Quantity</Typography>
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a href={`tel:${brand.contactPhone}`} className="flex-1">
          <Button variant="primary" size="lg" className="w-full">
            <Icon icon={Phone} size="sm" />
            Order Now — {brand.contactPhone}
          </Button>
        </a>
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={() => addItem(product.id, quantity)}
        >
          <Icon icon={ShoppingBag} size="sm" />
          Add to Cart
        </Button>
      </div>

      <div className="flex gap-2">
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
          {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() =>
            share({
              title: product.name,
              text: product.shortDescription,
              url: productUrl,
            })
          }
        >
          <Icon icon={Share2} size="sm" />
          {copied ? 'Link Copied!' : 'Share'}
        </Button>
      </div>
    </div>
  );
}
