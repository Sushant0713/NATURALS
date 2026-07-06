import type { Metadata } from 'next';

import { AccountLayout } from '@/components/account/account-layout';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'My Account',
  description: 'Manage your RAANJAAI NATURALS account.',
  path: '/account',
  noIndex: true,
});

export default function AccountRootLayout({ children }: { children: React.ReactNode }) {
  return <AccountLayout>{children}</AccountLayout>;
}
