import { Suspense } from 'react';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { CheckoutSuccessPage } from '@/components/checkout/checkout-success-content';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'Order Confirmed',
  description: 'Your RAANJAAI NATURALS order has been confirmed.',
  path: '/checkout/success',
  noIndex: true,
});

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-18">
        <Suspense>
          <ProtectedRoute>
            <CheckoutSuccessPage />
          </ProtectedRoute>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
