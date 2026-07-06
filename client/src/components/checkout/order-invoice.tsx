'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Download, Printer } from 'lucide-react';

import { Button, Card, Icon, Typography } from '@/components/ui';
import { brand } from '@/constants/brand';
import { formatINR } from '@/constants/pricing';
import { routes } from '@/constants/routes';
import type { OrderDetails } from '@/types/checkout';

interface OrderInvoiceProps {
  order: OrderDetails;
  showActions?: boolean;
}

export function OrderInvoice({ order, showActions = true }: OrderInvoiceProps) {
  const handlePrint = () => window.print();

  return (
    <Card padding="md" className="print:border-0 print:shadow-none">
      {showActions && (
        <div className="mb-6 flex flex-wrap gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Icon icon={Printer} size="sm" />
            Print Invoice
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Icon icon={Download} size="sm" />
            Download / Save PDF
          </Button>
        </div>
      )}

      <div className="border-b border-border pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Typography variant="h4" as="p">
              {brand.name}
            </Typography>
            <Typography variant="caption" className="mt-1 block">
              {brand.tagline}
            </Typography>
            <Typography variant="caption" className="mt-2 block">
              Phone: {brand.contactPhone}
            </Typography>
          </div>
          <div className="text-right">
            <Typography variant="overline">Tax Invoice</Typography>
            <Typography variant="h5" as="p" className="mt-1">
              {order.orderNumber}
            </Typography>
            <Typography variant="caption" className="mt-1 block">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </div>
        </div>
      </div>

      <div className="grid gap-6 border-b border-border py-6 sm:grid-cols-2">
        <div>
          <Typography variant="label" className="text-muted-foreground">
            Bill To
          </Typography>
          <Typography variant="body-sm" className="mt-2">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.phone}
            <br />
            {order.shippingAddress.addressLine1}
            {order.shippingAddress.addressLine2 && (
              <>
                <br />
                {order.shippingAddress.addressLine2}
              </>
            )}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
            {order.shippingAddress.pincode}
          </Typography>
        </div>
        <div>
          <Typography variant="label" className="text-muted-foreground">
            Payment
          </Typography>
          <Typography variant="body-sm" className="mt-2">
            Status: {order.payment.status}
            <br />
            Amount: {formatINR(order.payment.amount)}
            {order.payment.paidAt && (
              <>
                <br />
                Paid: {new Date(order.payment.paidAt).toLocaleString('en-IN')}
              </>
            )}
          </Typography>
        </div>
      </div>

      <div className="overflow-x-auto py-6">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-2 font-medium">Item</th>
              <th className="pb-2 font-medium">Qty</th>
              <th className="pb-2 font-medium">Price</th>
              <th className="pb-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={`${item.productName}-${item.variantLabel}`} className="border-b border-border/60">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <div className="relative size-10 shrink-0 overflow-hidden rounded bg-surface-muted">
                        <Image src={item.imageUrl} alt="" fill className="object-cover" sizes="40px" />
                      </div>
                    )}
                    <div>
                      <span className="font-medium">{item.productName}</span>
                      <span className="block text-xs text-muted-foreground">{item.variantLabel}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 tabular-nums">{item.quantity}</td>
                <td className="py-3 tabular-nums">{formatINR(item.unitPrice)}</td>
                <td className="py-3 text-right tabular-nums">{formatINR(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-full max-w-xs space-y-2 text-sm">
          <InvoiceRow label="Subtotal" value={formatINR(order.subtotal)} />
          {order.discount > 0 && (
            <InvoiceRow label="Discount" value={`−${formatINR(order.discount)}`} />
          )}
          <InvoiceRow
            label="Shipping"
            value={order.shipping === 0 ? 'Free' : formatINR(order.shipping)}
          />
          <InvoiceRow label="GST (5%)" value={formatINR(order.tax)} />
          <div className="flex justify-between border-t border-border pt-2 font-semibold">
            <span>Total</span>
            <span>{formatINR(order.total)}</span>
          </div>
        </div>
      </div>

      <Typography variant="caption" className="mt-8 block text-center text-muted-foreground">
        Thank you for choosing {brand.name}. Nature&apos;s bounty in every grain!
      </Typography>
    </Card>
  );
}

function InvoiceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

export function OrderConfirmation({ order }: { order: OrderDetails }) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15">
        <span className="text-3xl">✓</span>
      </div>
      <div>
        <Typography variant="h2" className="text-2xl sm:text-3xl">
          Order Confirmed!
        </Typography>
        <Typography variant="lead" className="mt-3">
          Thank you for your order. We&apos;re preparing your organic goodness with care.
        </Typography>
        <Typography variant="body-sm" className="mt-2 text-muted-foreground">
          Order <strong>{order.orderNumber}</strong> · {formatINR(order.total)}
        </Typography>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href={routes.products}>
          <Button variant="outline">Continue Shopping</Button>
        </Link>
        <Link href={routes.order(order.orderNumber)}>
          <Button>View Invoice</Button>
        </Link>
      </div>
    </div>
  );
}
