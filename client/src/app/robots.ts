import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/seo/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/account/',
          '/cart',
          '/checkout/',
          '/orders/',
          '/api/',
          '/design-system',
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
