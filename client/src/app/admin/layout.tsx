import type { Metadata } from 'next';

import { AdminLayout } from '@/components/admin/admin-layout';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Admin',
  path: '/admin',
  noIndex: true,
});

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
