'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';

import { OrderInvoice } from '@/components/checkout/order-invoice';
import { Container, Typography } from '@/components/ui';
import { QueryError } from '@/components/query/query-error';
import { QueryLoading } from '@/components/query/query-loading';
import { useOrderQuery } from '@/hooks/queries';

function OrderPageContent() {
  const params = useParams<{ orderNumber: string }>();
  const orderNumber = params.orderNumber ?? null;
  const { data: order, isLoading, isError, error, refetch } = useOrderQuery(orderNumber);

  if (isLoading) {
    return (
      <Container className="py-16">
        <QueryLoading />
      </Container>
    );
  }

  if (isError || !order) {
    return (
      <Container className="py-16">
        <QueryError
          error={error}
          onRetry={() => refetch()}
          title="Order not found"
        />
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12">
      <Typography variant="overline">Invoice</Typography>
      <Typography variant="h1" className="mt-2 text-3xl">
        {order.orderNumber}
      </Typography>
      <div className="mt-8">
        <OrderInvoice order={order} />
      </div>
    </Container>
  );
}

export function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-16">
          <QueryLoading />
        </Container>
      }
    >
      <OrderPageContent />
    </Suspense>
  );
}
