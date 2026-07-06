import { Suspense } from 'react';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { CheckoutFailurePage } from '@/components/checkout/checkout-failure-content';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'Payment Failed',
  description: 'Your payment could not be completed.',
  path: '/checkout/failure',
  noIndex: true,
});

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-18">
        <Suspense>
          <ProtectedRoute>
            <CheckoutFailurePage />
          </ProtectedRoute>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
