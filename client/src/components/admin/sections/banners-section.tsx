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
import {
  useAdminBannersQuery,
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useUpdateBannerMutation,
} from '@/hooks/queries';
import { getErrorMessage } from '@/lib/api/api-error';
import type { AdminBanner } from '@/types/admin';

const PLACEMENTS = ['hero', 'home', 'category', 'promo'] as const;

export function BannersSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBanner | null>(null);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '',
    linkLabel: '',
    placement: 'home',
    sortOrder: '0',
    isActive: true,
  });

  const { data: items = [], isLoading, isError, error, refetch } = useAdminBannersQuery();
  const createMutation = useCreateBannerMutation();
  const updateMutation = useUpdateBannerMutation();
  const deleteMutation = useDeleteBannerMutation();

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: '',
      subtitle: '',
      imageUrl: '',
      linkUrl: '',
      linkLabel: '',
      placement: 'home',
      sortOrder: '0',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (banner: AdminBanner) => {
    setEditing(banner);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle ?? '',
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl ?? '',
      linkLabel: banner.linkLabel ?? '',
      placement: banner.placement,
      sortOrder: String(banner.sortOrder),
      isActive: banner.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const payload = {
      title: form.title,
      subtitle: form.subtitle || undefined,
      imageUrl: form.imageUrl,
      linkUrl: form.linkUrl || undefined,
      linkLabel: form.linkLabel || undefined,
      placement: form.placement,
      sortOrder: Number(form.sortOrder),
      isActive: form.isActive,
    };
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
    if (!confirm('Delete this banner?')) return;
    deleteMutation.mutate(id);
  };

  const saving = createMutation.isPending || updateMutation.isPending;
  const saveError = editing ? updateMutation.error : createMutation.error;
  const showSaveError = editing ? updateMutation.isError : createMutation.isError;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Banner Management"
        description="Manage homepage and promotional banners"
        actions={
          <Button size="sm" onClick={openCreate}>
            Add Banner
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
            No banners yet
          </Typography>
        </Card>
      ) : (
        <AdminTable>
          <AdminTableHead>
            <AdminTableHeaderCell>Title</AdminTableHeaderCell>
            <AdminTableHeaderCell>Placement</AdminTableHeaderCell>
            <AdminTableHeaderCell>Order</AdminTableHeaderCell>
            <AdminTableHeaderCell>Status</AdminTableHeaderCell>
            <AdminTableHeaderCell />
          </AdminTableHead>
          <AdminTableBody>
            {items.map((banner) => (
              <AdminTableRow key={banner.id}>
                <AdminTableCell>
                  <Typography variant="label">{banner.title}</Typography>
                  {banner.subtitle && (
                    <Typography variant="caption" className="text-muted-foreground">
                      {banner.subtitle}
                    </Typography>
                  )}
                </AdminTableCell>
                <AdminTableCell>
                  <Badge variant="muted">{banner.placement}</Badge>
                </AdminTableCell>
                <AdminTableCell>{banner.sortOrder}</AdminTableCell>
                <AdminTableCell>
                  <Badge variant={banner.isActive ? 'success' : 'muted'}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(banner)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(banner.id)}
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
        title={editing ? 'Edit Banner' : 'Add Banner'}
        className="sm:max-w-xl"
      >
        <div className="space-y-4 p-5">
          {showSaveError && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {getErrorMessage(saveError)}
            </div>
          )}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="/catalogue/..."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input
                value={form.linkUrl}
                onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Link Label</Label>
              <Input
                value={form.linkLabel}
                onChange={(e) => setForm({ ...form, linkLabel: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Placement</Label>
              <select
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                value={form.placement}
                onChange={(e) => setForm({ ...form, placement: e.target.value })}
              >
                {PLACEMENTS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
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
            {saving ? 'Saving...' : 'Save Banner'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
