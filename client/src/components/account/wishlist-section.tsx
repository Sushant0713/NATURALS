'use client';

import Link from 'next/link';

import { ProductCard } from '@/components/product/product-card';
import { useWishlist } from '@/hooks/use-wishlist';
import { Button, Card, Typography } from '@/components/ui';
import { QueryLoading } from '@/components/query/query-loading';
import { catalogueProducts } from '@/constants/products';
import { routes } from '@/constants/routes';

export function WishlistSection() {
  const { ids, isHydrated, remove } = useWishlist();
  const products = catalogueProducts.filter((p) => ids.includes(p.id));

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h1" className="text-2xl sm:text-3xl">
          My Wishlist
        </Typography>
        <Typography variant="body-sm" className="mt-2 text-muted-foreground">
          Products you&apos;ve saved for later
        </Typography>
      </div>

      {!isHydrated ? (
        <QueryLoading variant="cards" rows={4} />
      ) : products.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Typography variant="h5" as="p">
            Your wishlist is empty
          </Typography>
          <Link href={routes.products}>
            <Button className="mt-4">Discover Products</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 z-10 bg-surface/80 text-xs"
                onClick={() => remove(product.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
