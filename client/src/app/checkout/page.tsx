import { Suspense } from 'react';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { CheckoutPageContent } from '@/components/checkout/checkout-page-content';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { routes } from '@/constants/routes';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'Checkout',
  description: 'Complete your RAANJAAI NATURALS order securely.',
  path: '/checkout',
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-18">
        <Suspense fallback={<CheckoutFallback />}>
          <ProtectedRoute redirectTo={routes.login}>
            <CheckoutPageContent />
          </ProtectedRoute>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function CheckoutFallback() {
  return (
    <div className="container mx-auto animate-pulse px-4 py-12">
      <div className="h-10 w-56 rounded-lg bg-muted" />
    </div>
  );
}
