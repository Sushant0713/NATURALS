'use client';

import { useState } from 'react';

import { ProductCard } from '@/components/product/product-card';
import { ProductFilters } from '@/components/product/product-filters';
import { ProductPagination } from '@/components/product/product-pagination';
import { ProductQuickView } from '@/components/product/product-quick-view';
import { ProductToolbar } from '@/components/product/product-toolbar';
import { Container, Typography } from '@/components/ui';
import { categoryLabels, type ProductCategorySlug } from '@/constants/categories';
import type { CatalogueProduct } from '@/constants/products';
import { useProductListing } from '@/hooks/use-product-listing';

interface ProductListingProps {
  lockedCategory?: ProductCategorySlug;
  title?: string;
  description?: string;
}

export function ProductListing({
  lockedCategory,
  title = 'All Products',
  description = 'Explore our complete range of organic and heritage foods — chemical-free, traditionally hand-crafted.',
}: ProductListingProps) {
  const {
    filters,
    pagination,
    updateFilters,
    setPage,
    clearFilters,
    activeFilterCount,
  } = useProductListing(lockedCategory);

  const [quickViewProduct, setQuickViewProduct] = useState<CatalogueProduct | null>(null);

  const displayTitle = lockedCategory ? categoryLabels[lockedCategory] : title;

  return (
    <Container className="py-8 md:py-12">
      <div className="mb-8">
        <Typography variant="overline">Shop</Typography>
        <Typography variant="h1" className="mt-2 text-3xl sm:text-4xl">
          {displayTitle}
        </Typography>
        <Typography variant="lead" className="mt-3 max-w-2xl">
          {description}
        </Typography>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr]">
        <ProductFilters
          filters={filters}
          onChange={updateFilters}
          onClear={clearFilters}
          activeCount={activeFilterCount}
          lockedCategory={lockedCategory}
        />

        <div className="min-w-0 space-y-6">
          <ProductToolbar
            filters={filters}
            total={pagination.total}
            start={pagination.start}
            end={pagination.end}
            onSearch={(query) => updateFilters({ query })}
            onSort={(sort) => updateFilters({ sort })}
          />

          {pagination.items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface-muted py-16 text-center">
              <Typography variant="h5" as="p">
                No products found
              </Typography>
              <Typography variant="body-sm" className="mt-2 text-muted-foreground">
                Try adjusting your search or filters.
              </Typography>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 font-accent text-sm font-medium text-secondary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {pagination.items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>

              <ProductPagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
                className="pt-4"
              />
            </>
          )}
        </div>
      </div>

      <ProductQuickView
        product={quickViewProduct}
        open={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
      />
    </Container>
  );
}
