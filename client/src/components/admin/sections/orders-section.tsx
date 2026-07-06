'use client';

import { useState } from 'react';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminPagination } from '@/components/admin/admin-pagination';
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from '@/components/admin/admin-table';
import { Badge, Button, Card, Input, Label, Modal, Typography } from '@/components/ui';
import { QueryError } from '@/components/query/query-error';
import { QueryLoading } from '@/components/query/query-loading';
import { formatINR } from '@/constants/pricing';
import { getErrorMessage } from '@/lib/api/api-error';
import { useAdminOrdersQuery, useUpdateOrderStatusMutation } from '@/hooks/queries';
import type { AdminOrder } from '@/types/admin';

const ORDER_STATUSES = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
] as const;

const statusVariant: Record<string, 'success' | 'warning' | 'muted' | 'destructive'> = {
  CONFIRMED: 'success', PENDING: 'warning', PROCESSING: 'warning',
  SHIPPED: 'success', DELIVERED: 'success', CANCELLED: 'destructive', REFUNDED: 'muted',
};

export function OrdersSection() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading, isError, error, refetch } = useAdminOrdersQuery(page, statusFilter || undefined);
  const updateMutation = useUpdateOrderStatusMutation();
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [tracking, setTracking] = useState('');

  const items = data?.items ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 };

  const openUpdate = (order: AdminOrder) => {
    setSelected(order);
    setNewStatus(order.status);
    setTracking(order.trackingNumber ?? '');
  };

  const handleUpdate = () => {
    if (!selected) return;
    updateMutation.mutate(
      { id: selected.id, status: newStatus, trackingNumber: tracking || undefined },
      { onSuccess: () => setSelected(null) }
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Orders" description="Manage customer orders and fulfillment" />

      <div className="flex flex-wrap gap-2">
        <Button variant={statusFilter === '' ? 'primary' : 'outline'} size="sm" onClick={() => { setStatusFilter(''); setPage(1); }}>All</Button>
        {ORDER_STATUSES.map((s) => (
          <Button key={s} variant={statusFilter === s ? 'primary' : 'outline'} size="sm" onClick={() => { setStatusFilter(s); setPage(1); }}>{s}</Button>
        ))}
      </div>

      {isLoading ? (
        <QueryLoading />
      ) : isError ? (
        <QueryError error={error} onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Typography variant="body-sm" className="text-muted-foreground">No orders found</Typography>
        </Card>
      ) : (
        <>
          <AdminTable>
            <AdminTableHead>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell>Customer</AdminTableHeaderCell>
              <AdminTableHeaderCell>Date</AdminTableHeaderCell>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
              <AdminTableHeaderCell>Total</AdminTableHeaderCell>
              <AdminTableHeaderCell />
            </AdminTableHead>
            <AdminTableBody>
              {items.map((order) => (
                <AdminTableRow key={order.id}>
                  <AdminTableCell><Typography variant="label">{order.orderNumber}</Typography></AdminTableCell>
                  <AdminTableCell>
                    <Typography variant="body-sm">{order.customerName ?? '—'}</Typography>
                    <Typography variant="caption" className="text-muted-foreground">{order.customerEmail}</Typography>
                  </AdminTableCell>
                  <AdminTableCell>{new Date(order.createdAt).toLocaleDateString('en-IN')}</AdminTableCell>
                  <AdminTableCell><Badge variant={statusVariant[order.status] ?? 'muted'}>{order.status}</Badge></AdminTableCell>
                  <AdminTableCell>{formatINR(order.total)}</AdminTableCell>
                  <AdminTableCell>
                    <Button variant="outline" size="sm" onClick={() => openUpdate(order)}>Update</Button>
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>
          <AdminPagination meta={meta} onPageChange={setPage} />
        </>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Update Order Status">
        {selected && (
          <div className="space-y-4 p-5">
            <Typography variant="body-sm" className="text-muted-foreground">Order {selected.orderNumber}</Typography>
            {updateMutation.isError && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {getErrorMessage(updateMutation.error)}
              </div>
            )}
            <div className="space-y-2">
              <Label>Status</Label>
              <select className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Tracking Number</Label>
              <Input value={tracking} onChange={(e) => setTracking(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
