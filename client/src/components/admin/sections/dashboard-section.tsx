'use client';

import Link from 'next/link';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatCard } from '@/components/admin/stat-card';
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from '@/components/admin/admin-table';
import { Badge, Button, Card, Typography } from '@/components/ui';
import { QueryError } from '@/components/query/query-error';
import { QueryLoading } from '@/components/query/query-loading';
import { adminRoutes } from '@/constants/admin-routes';
import { formatINR } from '@/constants/pricing';
import { useAdminDashboardQuery } from '@/hooks/queries';

const statusVariant: Record<string, 'success' | 'warning' | 'muted' | 'destructive'> = {
  CONFIRMED: 'success',
  PENDING: 'warning',
  PROCESSING: 'warning',
  SHIPPED: 'success',
  DELIVERED: 'success',
  CANCELLED: 'destructive',
  REFUNDED: 'muted',
};

export function DashboardSection() {
  const { data: stats, isLoading, isError, error, refetch } = useAdminDashboardQuery();

  if (isLoading) return <QueryLoading className="h-64" />;

  if (isError || !stats) {
    return <QueryError error={error} onRetry={() => refetch()} title="Failed to load dashboard" />;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Dashboard" description="Overview of your store performance" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Products" value={stats.totalProducts} />
        <StatCard label="Revenue (30d)" value={formatINR(stats.revenue30d)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Pending Orders" value={stats.pendingOrders} hint="Needs attention" />
        <StatCard label="Low Stock Items" value={stats.lowStockAlerts.length} hint="Below threshold" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <Typography variant="h5">Recent Orders</Typography>
            <Link href={adminRoutes.orders}>
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <Card padding="md">
              <Typography variant="body-sm" className="text-muted-foreground">No orders yet</Typography>
            </Card>
          ) : (
            <AdminTable>
              <AdminTableHead>
                <AdminTableHeaderCell>Order</AdminTableHeaderCell>
                <AdminTableHeaderCell>Status</AdminTableHeaderCell>
                <AdminTableHeaderCell>Total</AdminTableHeaderCell>
              </AdminTableHead>
              <AdminTableBody>
                {stats.recentOrders.map((order) => (
                  <AdminTableRow key={order.id}>
                    <AdminTableCell><Typography variant="label">{order.orderNumber}</Typography></AdminTableCell>
                    <AdminTableCell><Badge variant={statusVariant[order.status] ?? 'muted'}>{order.status}</Badge></AdminTableCell>
                    <AdminTableCell>{formatINR(order.total)}</AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTableBody>
            </AdminTable>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <Typography variant="h5">Low Stock Alerts</Typography>
            <Link href={adminRoutes.inventory}>
              <Button variant="outline" size="sm">Manage</Button>
            </Link>
          </div>
          {stats.lowStockAlerts.length === 0 ? (
            <Card padding="md">
              <Typography variant="body-sm" className="text-muted-foreground">All stock levels healthy</Typography>
            </Card>
          ) : (
            <AdminTable>
              <AdminTableHead>
                <AdminTableHeaderCell>Product</AdminTableHeaderCell>
                <AdminTableHeaderCell>Stock</AdminTableHeaderCell>
              </AdminTableHead>
              <AdminTableBody>
                {stats.lowStockAlerts.map((item) => (
                  <AdminTableRow key={item.id}>
                    <AdminTableCell>{item.name}</AdminTableCell>
                    <AdminTableCell><Badge variant="warning">{item.stock}</Badge></AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTableBody>
            </AdminTable>
          )}
        </div>
      </div>
    </div>
  );
}
