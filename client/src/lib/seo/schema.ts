import type { ProductDetail } from '@/lib/products/product-detail-types';
import { categoryLabels } from '@/constants/categories';
import { getProductPrice } from '@/constants/pricing';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';

type JsonLd = Record<string, unknown>;

export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.defaultOgImage),
    description: siteConfig.description,
    telephone: `+91${siteConfig.contactPhone}`,
    sameAs: [siteConfig.instagramUrl],
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { '@type': 'Organization', name: siteConfig.name },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productSchema(product: ProductDetail): JsonLd {
  const price = getProductPrice(product.id);
  const categoryLabel = categoryLabels[product.category];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: product.gallery.map((src) => absoluteUrl(src)),
    sku: product.id,
    brand: { '@type': 'Brand', name: siteConfig.name },
    category: categoryLabel,
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: 'INR',
      price,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: siteConfig.name },
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.averageRating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function itemListSchema(items: { name: string; url: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.url),
    })),
  };
}
