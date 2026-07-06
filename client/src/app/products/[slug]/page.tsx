import { notFound } from 'next/navigation';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { ProductDetailView } from '@/components/product/product-detail-view';
import { JsonLd } from '@/components/seo/json-ld';
import { categoryLabels, type ProductCategorySlug } from '@/constants/categories';
import { catalogueProducts, getRelatedProductsBySlug } from '@/constants/products';
import { getProductDetail } from '@/lib/products/get-product-detail';
import { createProductMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, faqSchema, productSchema } from '@/lib/seo/schema';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return catalogueProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductDetail(slug);

  if (!product) {
    return { title: 'Product Not Found', robots: { index: false, follow: false } };
  }

  return createProductMetadata({
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    image: product.image,
    categoryLabel: categoryLabels[product.category],
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductDetail(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProductsBySlug(slug);
  const categoryLabel = categoryLabels[product.category as ProductCategorySlug];

  const schemas = [
    productSchema(product),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
      { name: categoryLabel, path: `/categories/${product.category}` },
      { name: product.name, path: `/products/${product.slug}` },
    ]),
    faqSchema(product.faqs),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-18">
        <ProductDetailView product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </>
  );
}
