'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';

import { Button, Container, Icon, Typography } from '@/components/ui';
import { routes } from '@/constants/routes';
import { verifyOrder } from '@/lib/api/checkout';

function CheckoutFailureContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order_number');
  const [reason, setReason] = useState<string>('Payment was not completed.');

  useEffect(() => {
    if (!orderNumber) return;

    verifyOrder(orderNumber)
      .then((order) => {
        if (order.payment.status === 'FAILED') {
          setReason('Your payment could not be processed. Please try again.');
        }
      })
      .catch(() => undefined);
  }, [orderNumber]);

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-destructive/15">
        <Icon icon={XCircle} size="xl" className="text-destructive" />
      </div>

      <Typography variant="h2" className="text-2xl sm:text-3xl">
        Payment Failed
      </Typography>
      <Typography variant="lead" className="mt-3 max-w-md">
        {reason}
      </Typography>

      {orderNumber && (
        <Typography variant="caption" className="mt-2">
          Order reference: {orderNumber}
        </Typography>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={routes.checkout}>
          <Button>Try Again</Button>
        </Link>
        <Link href={routes.cart}>
          <Button variant="outline">Back to Cart</Button>
        </Link>
        <a href={`tel:8767047134`}>
          <Button variant="ghost">Call to Order</Button>
        </a>
      </div>
    </Container>
  );
}

export function CheckoutFailurePage() {
  return (
    <Suspense>
      <CheckoutFailureContent />
    </Suspense>
  );
}
