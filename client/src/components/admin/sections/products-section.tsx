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
import { Badge, Button, Input, Label, Modal, Typography } from '@/components/ui';
import { formatINR } from '@/constants/pricing';
import {
  useAdminCategoriesQuery,
  useAdminProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useSyncCatalogueMutation,
  useUpdateProductMutation,
} from '@/hooks/queries';
import { getErrorMessage } from '@/lib/api/api-error';
import type { AdminProduct } from '@/types/admin';

export function ProductsSection() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState({
    categoryId: '',
    name: '',
    slug: '',
    price: '',
    stockQuantity: '0',
    isActive: true,
    isOrganic: true,
    isBestseller: false,
  });

  const { data, isLoading, isError, error, refetch } = useAdminProductsQuery(page, search || undefined);
  const { data: categories = [] } = useAdminCategoriesQuery();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();
  const syncMutation = useSyncCatalogueMutation();

  const items = data?.items ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 };

  const openCreate = () => {
    setEditing(null);
    setForm({
      categoryId: categories[0]?.id ?? '',
      name: '',
      slug: '',
      price: '',
      stockQuantity: '0',
      isActive: true,
      isOrganic: true,
      isBestseller: false,
    });
    setModalOpen(true);
  };

  const openEdit = (product: AdminProduct) => {
    setEditing(product);
    const cat = product.category as { id?: string } | null;
    setForm({
      categoryId: cat?.id ?? categories[0]?.id ?? '',
      name: product.name,
      slug: product.slug,
      price: String(product.startingPrice ?? 0),
      stockQuantity: String(product.stock),
      isActive: product.isActive,
      isOrganic: product.isOrganic,
      isBestseller: product.isBestseller,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const payload = {
      categoryId: form.categoryId,
      name: form.name,
      slug: form.slug,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      isActive: form.isActive,
      isOrganic: form.isOrganic,
      isBestseller: form.isBestseller,
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
    if (!confirm('Delete this product?')) return;
    deleteMutation.mutate(id);
  };

  const handleSync = () => {
    syncMutation.mutate();
  };

  const saving = createMutation.isPending || updateMutation.isPending;
  const saveError = editing ? updateMutation.error : createMutation.error;
  const showSaveError = editing ? updateMutation.isError : createMutation.isError;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        description="Manage product catalogue"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleSync} disabled={syncMutation.isPending}>
              {syncMutation.isPending ? 'Syncing...' : 'Sync Catalogue'}
            </Button>
            <Button size="sm" onClick={openCreate}>
              Add Product
            </Button>
          </>
        }
      />

      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="max-w-sm"
      />

      {isLoading ? (
        <QueryLoading />
      ) : isError ? (
        <QueryError error={error} onRetry={() => refetch()} />
      ) : (
        <>
          <AdminTable>
            <AdminTableHead>
              <AdminTableHeaderCell>Product</AdminTableHeaderCell>
              <AdminTableHeaderCell>Price</AdminTableHeaderCell>
              <AdminTableHeaderCell>Stock</AdminTableHeaderCell>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
              <AdminTableHeaderCell />
            </AdminTableHead>
            <AdminTableBody>
              {items.map((product) => (
                <AdminTableRow key={product.id}>
                  <AdminTableCell>
                    <Typography variant="label">{product.name}</Typography>
                    <Typography variant="caption" className="text-muted-foreground">
                      {product.slug}
                    </Typography>
                  </AdminTableCell>
                  <AdminTableCell>{formatINR(product.startingPrice ?? 0)}</AdminTableCell>
                  <AdminTableCell>{product.stock}</AdminTableCell>
                  <AdminTableCell>
                    <Badge variant={product.isActive ? 'success' : 'muted'}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </AdminTableCell>
                  <AdminTableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(product)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
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
          <AdminPagination meta={meta} onPageChange={setPage} />
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Product' : 'Add Product'}
        className="sm:max-w-xl"
      >
        <div className="space-y-4 p-5">
          {showSaveError && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {getErrorMessage(saveError)}
            </div>
          )}
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Price (INR)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input
                type="number"
                value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isOrganic}
                onChange={(e) => setForm({ ...form, isOrganic: e.target.checked })}
              />
              Organic
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isBestseller}
                onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })}
              />
              Bestseller
            </label>
          </div>
          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
