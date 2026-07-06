import { Suspense } from 'react';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { CartPageContent } from '@/components/cart/cart-page-content';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'Your Cart',
  description: 'Review your RAANJAAI NATURALS order.',
  path: '/cart',
  noIndex: true,
});

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-18">
        <Suspense fallback={<CartPageFallback />}>
          <ProtectedRoute>
            <CartPageContent />
          </ProtectedRoute>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function CartPageFallback() {
  return (
    <div className="container mx-auto animate-pulse px-4 py-12">
      <div className="h-10 w-48 rounded-lg bg-muted" />
    </div>
  );
}
