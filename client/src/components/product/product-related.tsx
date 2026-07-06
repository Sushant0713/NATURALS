import Link from 'next/link';

import { ProductCard } from '@/components/product/product-card';
import { Container, Typography } from '@/components/ui';
import type { CatalogueProduct } from '@/constants/products';
import { routes } from '@/constants/routes';

interface ProductRelatedProps {
  products: CatalogueProduct[];
  categoryLabel: string;
}

export function ProductRelated({ products, categoryLabel }: ProductRelatedProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface-muted py-12 md:py-16">
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <Typography variant="overline">You May Also Like</Typography>
            <Typography variant="h2" className="mt-2 text-2xl sm:text-3xl">
              Related Products
            </Typography>
            <Typography variant="body-sm" className="mt-2 text-muted-foreground">
              More from {categoryLabel}
            </Typography>
          </div>
          <Link
            href={routes.products}
            className="hidden font-accent text-sm font-medium text-secondary hover:underline sm:block"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
