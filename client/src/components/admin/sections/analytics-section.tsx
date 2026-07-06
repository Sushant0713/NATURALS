'use client';

import { useState } from 'react';

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
import { Badge, Button, Typography } from '@/components/ui';
import { QueryError } from '@/components/query/query-error';
import { QueryLoading } from '@/components/query/query-loading';
import { formatINR } from '@/constants/pricing';
import { useAdminAnalyticsQuery } from '@/hooks/queries';

export function AnalyticsSection() {
  const [days, setDays] = useState(30);
  const { data, isLoading, isError, error, refetch, isFetching } = useAdminAnalyticsQuery(days);

  if (isLoading) return <QueryLoading className="h-64" />;

  if (isError || !data) {
    return <QueryError error={error} onRetry={() => refetch()} title="Failed to load analytics" />;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Analytics"
        description={`Performance over the last ${data.rangeDays} days`}
        actions={
          <div className="flex gap-2">
            {[7, 30, 90].map((d) => (
              <Button
                key={d}
                variant={days === d ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setDays(d)}
                disabled={isFetching && days === d}
              >
                {d}d
              </Button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Revenue" value={formatINR(data.totalRevenue)} />
        <StatCard label="Total Orders" value={data.totalOrders} />
      </div>

      <div>
        <Typography variant="h5" className="mb-3">Revenue by Day</Typography>
        <AdminTable>
          <AdminTableHead>
            <AdminTableHeaderCell>Date</AdminTableHeaderCell>
            <AdminTableHeaderCell>Orders</AdminTableHeaderCell>
            <AdminTableHeaderCell>Revenue</AdminTableHeaderCell>
          </AdminTableHead>
          <AdminTableBody>
            {data.revenueByDay.slice(-14).map((row) => (
              <AdminTableRow key={row.date}>
                <AdminTableCell>{row.date}</AdminTableCell>
                <AdminTableCell>{row.orders}</AdminTableCell>
                <AdminTableCell>{formatINR(row.revenue)}</AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <Typography variant="h5" className="mb-3">Orders by Status</Typography>
          <AdminTable>
            <AdminTableHead>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
              <AdminTableHeaderCell>Count</AdminTableHeaderCell>
            </AdminTableHead>
            <AdminTableBody>
              {data.ordersByStatus.map((row) => (
                <AdminTableRow key={row.status}>
                  <AdminTableCell><Badge variant="muted">{row.status}</Badge></AdminTableCell>
                  <AdminTableCell>{row.count}</AdminTableCell>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>
        </div>
        <div>
          <Typography variant="h5" className="mb-3">Top Products</Typography>
          <AdminTable>
            <AdminTableHead>
              <AdminTableHeaderCell>Product</AdminTableHeaderCell>
              <AdminTableHeaderCell>Qty</AdminTableHeaderCell>
              <AdminTableHeaderCell>Revenue</AdminTableHeaderCell>
            </AdminTableHead>
            <AdminTableBody>
              {data.topProducts.map((row) => (
                <AdminTableRow key={row.name}>
                  <AdminTableCell>{row.name}</AdminTableCell>
                  <AdminTableCell>{row.quantity}</AdminTableCell>
                  <AdminTableCell>{formatINR(row.revenue)}</AdminTableCell>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>
        </div>
      </div>
    </div>
  );
}
