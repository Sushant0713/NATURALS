import { HomePage } from '@/components/home/home-page';
import { createPageMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/lib/seo/site';

export const metadata = createPageMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: '/',
  keywords: [
    ...siteConfig.keywords,
    'organic baby food India',
    'millet products online',
    'bilona ghee',
  ],
});

export default function Page() {
  return <HomePage />;
}
