'use client';

import { useState } from 'react';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
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
import {
  useAdminCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useUpdateCouponMutation,
} from '@/hooks/queries';
import { getErrorMessage } from '@/lib/api/api-error';
import type { AdminCoupon } from '@/types/admin';

export function CouponsSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCoupon | null>(null);
  const [form, setForm] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: '',
    minOrderAmount: '0',
    maxUses: '',
    validFrom: '',
    validUntil: '',
    isActive: true,
  });

  const { data: items = [], isLoading, isError, error, refetch } = useAdminCouponsQuery();
  const createMutation = useCreateCouponMutation();
  const updateMutation = useUpdateCouponMutation();
  const deleteMutation = useDeleteCouponMutation();

  const openCreate = () => {
    setEditing(null);
    const today = new Date().toISOString().slice(0, 10);
    const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
    setForm({
      code: '',
      type: 'PERCENTAGE',
      value: '',
      minOrderAmount: '0',
      maxUses: '',
      validFrom: today,
      validUntil: nextMonth,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (coupon: AdminCoupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      minOrderAmount: String(coupon.minOrderAmount),
      maxUses: coupon.maxUses ? String(coupon.maxUses) : '',
      validFrom: coupon.validFrom.slice(0, 10),
      validUntil: coupon.validUntil.slice(0, 10),
      isActive: coupon.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const payload: Record<string, unknown> = {
      code: form.code,
      type: form.type,
      value: Number(form.value),
      minOrderAmount: Number(form.minOrderAmount),
      validFrom: form.validFrom,
      validUntil: form.validUntil,
      isActive: form.isActive,
    };
    if (form.maxUses) payload.maxUses = Number(form.maxUses);
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: payload },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => setModalOpen(false) });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    deleteMutation.mutate(id);
  };

  const saving = createMutation.isPending || updateMutation.isPending;
  const saveError = editing ? updateMutation.error : createMutation.error;
  const showSaveError = editing ? updateMutation.isError : createMutation.isError;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Coupons"
        description="Create and manage discount codes"
        actions={
          <Button size="sm" onClick={openCreate}>
            Add Coupon
          </Button>
        }
      />

      {isLoading ? (
        <QueryLoading />
      ) : isError ? (
        <QueryError error={error} onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Typography variant="body-sm" className="text-muted-foreground">
            No coupons yet
          </Typography>
        </Card>
      ) : (
        <AdminTable>
          <AdminTableHead>
            <AdminTableHeaderCell>Code</AdminTableHeaderCell>
            <AdminTableHeaderCell>Type</AdminTableHeaderCell>
            <AdminTableHeaderCell>Value</AdminTableHeaderCell>
            <AdminTableHeaderCell>Uses</AdminTableHeaderCell>
            <AdminTableHeaderCell>Valid Until</AdminTableHeaderCell>
            <AdminTableHeaderCell>Status</AdminTableHeaderCell>
            <AdminTableHeaderCell />
          </AdminTableHead>
          <AdminTableBody>
            {items.map((coupon) => (
              <AdminTableRow key={coupon.id}>
                <AdminTableCell>
                  <Typography variant="label">{coupon.code}</Typography>
                </AdminTableCell>
                <AdminTableCell>{coupon.type}</AdminTableCell>
                <AdminTableCell>
                  {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : formatINR(coupon.value)}
                </AdminTableCell>
                <AdminTableCell>
                  {coupon.usedCount}
                  {coupon.maxUses ? ` / ${coupon.maxUses}` : ''}
                </AdminTableCell>
                <AdminTableCell>
                  {new Date(coupon.validUntil).toLocaleDateString('en-IN')}
                </AdminTableCell>
                <AdminTableCell>
                  <Badge variant={coupon.isActive ? 'success' : 'muted'}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(coupon)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(coupon.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Coupon' : 'Add Coupon'}
        className="sm:max-w-xl"
      >
        <div className="space-y-4 p-5">
          {showSaveError && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {getErrorMessage(saveError)}
            </div>
          )}
          <div className="space-y-2">
            <Label>Code</Label>
            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <select
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed Amount</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Min Order (INR)</Label>
              <Input
                type="number"
                value={form.minOrderAmount}
                onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Uses</Label>
              <Input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Valid From</Label>
              <Input
                type="date"
                value={form.validFrom}
                onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Valid Until</Label>
              <Input
                type="date"
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active
          </label>
          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Coupon'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
