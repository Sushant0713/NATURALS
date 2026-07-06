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
import { QueryError } from '@/components/query/query-error';
import { QueryLoading } from '@/components/query/query-loading';
import { Badge, Button, Card, Input, Label, Modal, Typography } from '@/components/ui';
import { formatINR } from '@/constants/pricing';
import { useAdminInventoryQuery, useUpdateInventoryMutation } from '@/hooks/queries';
import { getErrorMessage } from '@/lib/api/api-error';
import type { InventoryItem } from '@/types/admin';

export function InventorySection() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [stock, setStock] = useState('');
  const [threshold, setThreshold] = useState('');

  const { data, isLoading, isError, error, refetch } = useAdminInventoryQuery(page);
  const updateMutation = useUpdateInventoryMutation();

  const items = data?.items ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 };

  const openEdit = (item: InventoryItem) => {
    setSelected(item);
    setStock(String(item.stockQuantity));
    setThreshold(String(item.lowStockThreshold));
  };

  const handleSave = () => {
    if (!selected) return;
    updateMutation.mutate(
      {
        productId: selected.productId,
        variantId: selected.variantId,
        data: {
          stockQuantity: Number(stock),
          lowStockThreshold: Number(threshold),
        },
      },
      { onSuccess: () => setSelected(null) }
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Inventory" description="Track and update stock levels" />

      {isLoading ? (
        <QueryLoading />
      ) : isError ? (
        <QueryError error={error} onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Typography variant="body-sm" className="text-muted-foreground">
            No inventory records
          </Typography>
        </Card>
      ) : (
        <>
          <AdminTable>
            <AdminTableHead>
              <AdminTableHeaderCell>Product</AdminTableHeaderCell>
              <AdminTableHeaderCell>Variant</AdminTableHeaderCell>
              <AdminTableHeaderCell>SKU</AdminTableHeaderCell>
              <AdminTableHeaderCell>Stock</AdminTableHeaderCell>
              <AdminTableHeaderCell>Price</AdminTableHeaderCell>
              <AdminTableHeaderCell />
            </AdminTableHead>
            <AdminTableBody>
              {items.map((item) => (
                <AdminTableRow key={`${item.productId}-${item.variantId}`}>
                  <AdminTableCell>{item.productName}</AdminTableCell>
                  <AdminTableCell>{item.label}</AdminTableCell>
                  <AdminTableCell>{item.sku}</AdminTableCell>
                  <AdminTableCell>
                    <Badge variant={item.isLowStock ? 'warning' : 'success'}>
                      {item.stockQuantity}
                    </Badge>
                  </AdminTableCell>
                  <AdminTableCell>{formatINR(item.price)}</AdminTableCell>
                  <AdminTableCell>
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                      Update
                    </Button>
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>
          <AdminPagination meta={meta} onPageChange={setPage} />
        </>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Update Stock">
        {selected && (
          <div className="space-y-4 p-5">
            <Typography variant="body-sm" className="text-muted-foreground">
              {selected.productName} — {selected.label}
            </Typography>
            {updateMutation.isError && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {getErrorMessage(updateMutation.error)}
              </div>
            )}
            <div className="space-y-2">
              <Label>Stock Quantity</Label>
              <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Low Stock Threshold</Label>
              <Input type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Stock'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
