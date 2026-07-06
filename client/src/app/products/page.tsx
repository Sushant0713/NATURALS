import { Suspense } from 'react';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { ProductListing } from '@/components/product/product-listing';
import { JsonLd } from '@/components/seo/json-ld';
import { catalogueProducts } from '@/constants/products';
import { createPageMetadata } from '@/lib/seo/metadata';
import { itemListSchema } from '@/lib/seo/schema';

export const metadata = createPageMetadata({
  title: 'All Products',
  description:
    'Browse our complete range of organic and heritage foods — chemical-free, traditionally hand-crafted by rural women.',
  path: '/products',
  keywords: ['organic products', 'heritage foods', 'millet snacks', 'baby cereal', 'shop online'],
});

function ProductsContent() {
  return <ProductListing />;
}

export default function ProductsPage() {
  const listSchema = itemListSchema(
    catalogueProducts.map((p) => ({ name: p.name, url: `/products/${p.slug}` }))
  );

  return (
    <>
      <JsonLd data={listSchema} />
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-18">
        <Suspense fallback={<ProductsListingFallback />}>
          <ProductsContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function ProductsListingFallback() {
  return (
    <div className="container mx-auto animate-pulse px-4 py-12">
      <div className="mb-8 h-10 w-64 rounded-lg bg-muted" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
