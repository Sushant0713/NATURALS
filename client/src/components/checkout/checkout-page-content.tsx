'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AddressForm } from '@/components/checkout/address-form';
import { CheckoutOrderSummary } from '@/components/checkout/checkout-order-summary';
import { PaymentSection } from '@/components/checkout/payment-section';
import { useCart } from '@/components/providers/cart-provider';
import { Button, Container, Input, Label, Typography } from '@/components/ui';
import { routes } from '@/constants/routes';
import { getErrorMessage } from '@/lib/api/api-error';
import { useCreateCheckoutMutation, usePaymentConfigQuery } from '@/hooks/queries';
import { launchCashfreeCheckout } from '@/lib/payments/cashfree';
import type { AddressSnapshot } from '@/types/checkout';

export function CheckoutPageContent() {
  const router = useRouter();
  const { totals, coupon, shippingMethod, isHydrated, clearCart } = useCart();
  const { data: paymentConfig } = usePaymentConfigQuery();
  const checkoutMutation = useCreateCheckoutMutation();

  const [address, setAddress] = useState<AddressSnapshot>({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    label: 'HOME',
  });
  const [saveAddress, setSaveAddress] = useState(true);
  const [notes, setNotes] = useState('');

  const config = paymentConfig ?? { provider: 'cashfree', mode: 'sandbox' as const };

  useEffect(() => {
    if (isHydrated && totals.lineItems.length === 0) {
      router.replace(routes.cart);
    }
  }, [isHydrated, totals.lineItems.length, router]);

  const handlePay = async () => {
    try {
      const result = await checkoutMutation.mutateAsync({
        items: totals.lineItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          imageUrl: item.image,
        })),
        shippingAddress: address,
        couponCode: coupon?.code,
        shippingMethod,
        notes: notes || undefined,
        saveAddress,
      });

      if (result.mock) {
        clearCart();
        router.push(`${routes.checkoutSuccess}?order_number=${result.orderNumber}`);
        return;
      }

      await launchCashfreeCheckout(result.paymentSessionId, config);
    } catch {
      // error surfaced via checkoutMutation.isError
    }
  };

  if (!isHydrated) {
    return (
      <Container className="py-12">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12">
      <Typography variant="overline">Checkout</Typography>
      <Typography variant="h1" className="mt-2 text-3xl sm:text-4xl">
        Complete Your Order
      </Typography>

      {checkoutMutation.isError && (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {getErrorMessage(checkoutMutation.error, 'Payment failed')}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
            <Typography variant="h5" as="h2" className="mb-5">
              Shipping Address
            </Typography>
            <AddressForm
              value={address}
              onChange={setAddress}
              saveAddress={saveAddress}
              onSaveAddressChange={setSaveAddress}
            />
          </section>

          <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
            <div className="space-y-2">
              <Label htmlFor="notes">Order Notes (optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Delivery instructions, gift message, etc."
              />
            </div>
          </section>

          <PaymentSection
            total={totals.total}
            cashfreeMode={config.mode}
            isProcessing={checkoutMutation.isPending}
            onPay={handlePay}
            disabled={!address.fullName || !address.phone || !address.addressLine1}
          />
        </div>

        <div>
          <CheckoutOrderSummary />
          <Button
            variant="ghost"
            className="mt-4 w-full"
            onClick={() => router.push(routes.cart)}
          >
            ← Back to Cart
          </Button>
        </div>
      </div>
    </Container>
  );
}
