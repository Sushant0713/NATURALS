import { brand } from '@/constants/brand';

export const siteMetadata = {
  title: brand.name,
  description: `${brand.tagline} Premium organic and heritage Indian foods — chemical-free, traditionally hand-crafted.`,
  keywords: [
    'organic food',
    'natural food',
    'baby cereal',
    'ragi',
    'heritage foods',
    'Maharashtrian food',
    'gluten free',
    'desi cow ghee',
    'Raanjaai Naturals',
  ],
} as const;
