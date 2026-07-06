import { redirect } from 'next/navigation';

import { routes } from '@/constants/routes';

export default function AccountPage() {
  redirect(routes.account.profile);
}
