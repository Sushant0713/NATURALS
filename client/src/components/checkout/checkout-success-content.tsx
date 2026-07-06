'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { OrderConfirmation, OrderInvoice } from '@/components/checkout/order-invoice';
import { useCart } from '@/components/providers/cart-provider';
import { Container, Typography } from '@/components/ui';
import { QueryError } from '@/components/query/query-error';
import { QueryLoading } from '@/components/query/query-loading';
import { routes } from '@/constants/routes';
import { useVerifyOrderQuery } from '@/hooks/queries';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const orderNumber = searchParams.get('order_number') ?? searchParams.get('order_id');

  const { data: order, isLoading, isError, error, refetch } = useVerifyOrderQuery(orderNumber);

  useEffect(() => {
    if (!orderNumber) {
      router.replace(routes.cart);
    }
  }, [orderNumber, router]);

  useEffect(() => {
    if (order?.payment.status === 'SUCCESS') {
      clearCart();
    }
  }, [order, clearCart]);

  useEffect(() => {
    if (order && order.payment.status !== 'SUCCESS') {
      router.replace(`${routes.checkoutFailure}?order_number=${order.orderNumber}`);
    }
  }, [order, router]);

  if (!orderNumber) return null;

  if (isLoading) {
    return (
      <Container className="py-16 text-center">
        <QueryLoading />
        <Typography variant="body" className="mt-4 text-muted-foreground">
          Verifying your payment...
        </Typography>
      </Container>
    );
  }

  if (isError || !order) {
    return (
      <Container className="py-16">
        <QueryError
          error={error}
          onRetry={() => refetch()}
          title="Unable to confirm order"
        />
      </Container>
    );
  }

  if (order.payment.status !== 'SUCCESS') {
    return null;
  }

  return (
    <Container className="py-8 md:py-12">
      <OrderConfirmation order={order} />
      <div className="mt-12">
        <OrderInvoice order={order} />
      </div>
    </Container>
  );
}

export function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-16 text-center">
          <QueryLoading />
        </Container>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
