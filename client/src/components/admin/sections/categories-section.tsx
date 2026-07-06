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
  useAdminCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '@/hooks/queries';
import { getErrorMessage } from '@/lib/api/api-error';
import type { AdminCategory } from '@/types/admin';

export function CategoriesSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    sortOrder: '0',
    isActive: true,
  });

  const { data: items = [], isLoading, isError, error, refetch } = useAdminCategoriesQuery();
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', slug: '', description: '', sortOrder: '0', isActive: true });
    setModalOpen(true);
  };

  const openEdit = (cat: AdminCategory) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      sortOrder: String(cat.sortOrder),
      isActive: cat.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || undefined,
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
    if (!confirm('Delete this category?')) return;
    deleteMutation.mutate(id);
  };

  const saving = createMutation.isPending || updateMutation.isPending;
  const saveError = editing ? updateMutation.error : createMutation.error;
  const showSaveError = editing ? updateMutation.isError : createMutation.isError;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Organize products into categories"
        actions={
          <Button size="sm" onClick={openCreate}>
            Add Category
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
            No categories yet
          </Typography>
        </Card>
      ) : (
        <AdminTable>
          <AdminTableHead>
            <AdminTableHeaderCell>Name</AdminTableHeaderCell>
            <AdminTableHeaderCell>Slug</AdminTableHeaderCell>
            <AdminTableHeaderCell>Products</AdminTableHeaderCell>
            <AdminTableHeaderCell>Status</AdminTableHeaderCell>
            <AdminTableHeaderCell />
          </AdminTableHead>
          <AdminTableBody>
            {items.map((cat) => (
              <AdminTableRow key={cat.id}>
                <AdminTableCell>{cat.name}</AdminTableCell>
                <AdminTableCell>{cat.slug}</AdminTableCell>
                <AdminTableCell>{cat.productCount}</AdminTableCell>
                <AdminTableCell>
                  <Badge variant={cat.isActive ? 'success' : 'muted'}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(cat)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(cat.id)}
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
        title={editing ? 'Edit Category' : 'Add Category'}
      >
        <div className="space-y-4 p-5">
          {showSaveError && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {getErrorMessage(saveError)}
            </div>
          )}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Sort Order</Label>
            <Input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            />
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
            {saving ? 'Saving...' : 'Save Category'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
