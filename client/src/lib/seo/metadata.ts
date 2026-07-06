import type { Metadata } from 'next';

import { siteConfig, absoluteUrl } from '@/lib/seo/site';

type RobotsDirective = Metadata['robots'];

export interface PageMetadataOptions {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  robots?: RobotsDirective;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
}

function buildRobots(noIndex?: boolean, robots?: RobotsDirective): RobotsDirective | undefined {
  if (robots) return robots;
  if (noIndex) {
    return { index: false, follow: false, googleBot: { index: false, follow: false } };
  }
  return {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  };
}

export function createPageMetadata({
  title,
  description = siteConfig.description,
  path = '/',
  image = siteConfig.defaultOgImage,
  imageAlt = siteConfig.name,
  keywords,
  robots,
  type = 'website',
  noIndex,
}: PageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(image);

  return {
    title,
    description,
    keywords: keywords ?? [...siteConfig.keywords],
    alternates: { canonical },
    robots: buildRobots(noIndex, robots),
    openGraph: {
      type: type === 'product' ? 'website' : type,
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title,
      description,
      images: [ogImage],
    },
  };
}

export function createProductMetadata(product: {
  name: string;
  slug: string;
  shortDescription: string;
  image: string;
  categoryLabel: string;
}): Metadata {
  const title = product.name;
  const description = `${product.shortDescription} Shop ${product.categoryLabel} at ${siteConfig.name}.`;
  const path = `/products/${product.slug}`;

  return createPageMetadata({
    title,
    description,
    path,
    image: product.image,
    imageAlt: product.name,
    keywords: [...siteConfig.keywords, product.name, product.categoryLabel, 'buy organic food online'],
    type: 'product',
  });
}

export const privatePageMetadata = createPageMetadata({
  title: 'Account',
  noIndex: true,
  path: '/account',
});
