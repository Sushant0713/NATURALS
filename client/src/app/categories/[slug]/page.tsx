import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { ProductListing } from '@/components/product/product-listing';
import { JsonLd } from '@/components/seo/json-ld';
import {
  categoryLabels,
  productCategories,
  type ProductCategorySlug,
} from '@/constants/categories';
import { catalogueProducts } from '@/constants/products';
import { createPageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, itemListSchema } from '@/lib/seo/schema';

const validSlugs = new Set<string>(Object.values(productCategories));

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.values(productCategories).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;

  if (!validSlugs.has(slug)) {
    return { title: 'Category Not Found', robots: { index: false, follow: false } };
  }

  const label = categoryLabels[slug as ProductCategorySlug];
  return createPageMetadata({
    title: label,
    description: `Browse ${label} — organic and heritage foods from RAANJAAI NATURALS. Chemical-free, traditionally hand-crafted.`,
    path: `/categories/${slug}`,
    keywords: [label, 'organic food', 'RAANJAAI NATURALS'],
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  if (!validSlugs.has(slug)) {
    notFound();
  }

  const category = slug as ProductCategorySlug;
  const label = categoryLabels[category];
  const categoryProducts = catalogueProducts.filter((p) => p.category === category);

  const schemas = [
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
      { name: label, path: `/categories/${slug}` },
    ]),
    itemListSchema(categoryProducts.map((p) => ({ name: p.name, url: `/products/${p.slug}` }))),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-18">
        <Suspense fallback={<CategoryListingFallback />}>
          <ProductListing lockedCategory={category} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function CategoryListingFallback() {
  return (
    <div className="container mx-auto animate-pulse px-4 py-12">
      <div className="mb-8 h-10 w-48 rounded-lg bg-muted" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
