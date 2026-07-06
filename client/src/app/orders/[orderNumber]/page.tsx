import { Suspense } from 'react';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { OrderDetailPage } from '@/components/checkout/order-detail-page';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { createPageMetadata } from '@/lib/seo/metadata';

interface PageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { orderNumber } = await params;
  return createPageMetadata({
    title: `Order ${orderNumber}`,
    description: 'View your RAANJAAI NATURALS order invoice.',
    path: `/orders/${orderNumber}`,
    noIndex: true,
  });
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-18">
        <Suspense>
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
