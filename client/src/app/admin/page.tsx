import { redirect } from 'next/navigation';

import { adminRoutes } from '@/constants/admin-routes';

export default function AdminIndexPage() {
  redirect(adminRoutes.dashboard);
}
