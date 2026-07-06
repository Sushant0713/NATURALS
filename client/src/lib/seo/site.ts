import { appConfig } from '@/config/app.config';
import { brand } from '@/constants/brand';
import { siteMetadata } from '@/constants/metadata';

export const siteConfig = {
  name: brand.name,
  shortName: 'RAANJAAI',
  tagline: brand.tagline,
  url: appConfig.url.replace(/\/$/, ''),
  description: siteMetadata.description,
  keywords: [...siteMetadata.keywords],
  locale: 'en_IN',
  defaultOgImage: '/catalogue/page-02-full.png',
  twitterHandle: '@RAANJAAINATURALS',
  contactPhone: brand.contactPhone,
  instagramUrl: brand.instagramUrl,
} as const;

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;
}
