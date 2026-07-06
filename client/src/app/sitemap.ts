import type { MetadataRoute } from 'next';

import { productCategories } from '@/constants/categories';
import { catalogueProducts } from '@/constants/products';
import { siteConfig } from '@/lib/seo/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = Object.values(productCategories).map((slug) => ({
    url: `${base}/categories/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = catalogueProducts.map((product) => ({
    url: `${base}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: product.isBestseller || product.isFeatured ? 0.85 : 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
