'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { ProductBenefits } from '@/components/product/product-benefits';
import { ProductDetailInfo } from '@/components/product/product-detail-info';
import { ProductFAQs } from '@/components/product/product-faqs';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductIngredients } from '@/components/product/product-ingredients';
import { ProductNutrition } from '@/components/product/product-nutrition';
import { ProductRelated } from '@/components/product/product-related';
import { ProductReviews } from '@/components/product/product-reviews';
import { Container } from '@/components/ui';
import { categoryLabels } from '@/constants/categories';
import type { CatalogueProduct } from '@/constants/products';
import { routes } from '@/constants/routes';
import type { ProductDetail } from '@/lib/products/product-detail-types';
import { cn } from '@/lib/utils';

const detailTabs = [
  { id: 'benefits', label: 'Benefits' },
  { id: 'ingredients', label: 'Ingredients' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'reviews', label: 'Reviews' },
] as const;

interface ProductDetailViewProps {
  product: ProductDetail;
  relatedProducts: CatalogueProduct[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  return (
    <>
      <Container className="py-8 md:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm">
          <Link href={routes.home} className="text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3.5 text-muted-foreground" />
          <Link href={routes.products} className="text-muted-foreground hover:text-foreground">
            Products
          </Link>
          <ChevronRight className="size-3.5 text-muted-foreground" />
          <Link
            href={`${routes.categories}/${product.category}`}
            className="text-muted-foreground hover:text-foreground"
          >
            {categoryLabels[product.category]}
          </Link>
          <ChevronRight className="size-3.5 text-muted-foreground" />
          <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
        </nav>

        {/* Hero: gallery + info */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.gallery} productName={product.name} />
          <ProductDetailInfo product={product} />
        </div>

        {/* Section nav */}
        <div className="mt-12 border-b border-border">
          <div className="flex gap-1 overflow-x-auto pb-px">
            {detailTabs.map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className={cn(
                  'shrink-0 border-b-2 border-transparent px-4 py-3 font-accent text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'
                )}
              >
                {tab.label}
              </a>
            ))}
          </div>
        </div>

        {/* Detail sections */}
        <div className="space-y-16 py-12">
          <ProductBenefits product={product} />
          <ProductIngredients product={product} />
          <ProductNutrition product={product} />
          <ProductFAQs faqs={product.faqs} />
          <ProductReviews
            reviews={product.reviews}
            averageRating={product.averageRating}
            reviewCount={product.reviewCount}
          />
        </div>
      </Container>

      <ProductRelated
        products={relatedProducts}
        categoryLabel={categoryLabels[product.category]}
      />
    </>
  );
}
