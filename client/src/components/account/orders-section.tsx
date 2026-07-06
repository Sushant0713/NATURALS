'use client';

import Link from 'next/link';

import { Badge, Button, Card, Typography } from '@/components/ui';
import { QueryError } from '@/components/query/query-error';
import { QueryLoading } from '@/components/query/query-loading';
import { formatINR } from '@/constants/pricing';
import { routes } from '@/constants/routes';
import { useOrdersQuery } from '@/hooks/queries';

const statusVariant: Record<string, 'success' | 'warning' | 'muted' | 'destructive'> = {
  CONFIRMED: 'success',
  PENDING: 'warning',
  PROCESSING: 'warning',
  SHIPPED: 'success',
  DELIVERED: 'success',
  CANCELLED: 'destructive',
  REFUNDED: 'muted',
};

export function OrdersSection() {
  const { data, isLoading, isError, error, refetch } = useOrdersQuery();
  const orders = data?.items ?? [];

  if (isLoading) return <QueryLoading />;

  if (isError) {
    return <QueryError error={error} onRetry={() => refetch()} title="Failed to load orders" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h1" className="text-2xl sm:text-3xl">
          My Orders
        </Typography>
        <Typography variant="body-sm" className="mt-2 text-muted-foreground">
          Track and view your order history
        </Typography>
      </div>

      {orders.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Typography variant="h5" as="p">
            No orders yet
          </Typography>
          <Typography variant="body-sm" className="mt-2 text-muted-foreground">
            Start shopping our organic range.
          </Typography>
          <Link href={routes.products}>
            <Button className="mt-4">Browse Products</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} padding="md">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Typography variant="label">{order.orderNumber}</Typography>
                  <Typography variant="caption" className="mt-1 block">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                    {' · '}
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant[order.status] ?? 'muted'}>{order.status}</Badge>
                  <Typography variant="label" className="tabular-nums">
                    {formatINR(order.total)}
                  </Typography>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={routes.order(order.orderNumber)}>
                  <Button variant="outline" size="sm">
                    View Invoice
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
