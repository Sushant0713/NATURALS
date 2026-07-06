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
import { useAdminUsersQuery, useUpdateUserMutation } from '@/hooks/queries';
import { getErrorMessage } from '@/lib/api/api-error';
import type { AdminUser } from '@/types/admin';

const ROLES = ['CUSTOMER', 'ADMIN', 'SUPER_ADMIN'] as const;

export function UsersSection() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [role, setRole] = useState('');
  const [isActive, setIsActive] = useState(true);

  const { data, isLoading, isError, error, refetch } = useAdminUsersQuery(page, search || undefined);
  const updateMutation = useUpdateUserMutation();

  const items = data?.items ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 };

  const openEdit = (user: AdminUser) => {
    setSelected(user);
    setRole(user.role);
    setIsActive(user.isActive);
  };

  const handleSave = () => {
    if (!selected) return;
    updateMutation.mutate(
      { id: selected.id, data: { role, isActive } },
      { onSuccess: () => setSelected(null) }
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Users" description="Manage customer and admin accounts" />

      <Input
        placeholder="Search by name or email..."
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
      ) : items.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Typography variant="body-sm" className="text-muted-foreground">
            No users found
          </Typography>
        </Card>
      ) : (
        <>
          <AdminTable>
            <AdminTableHead>
              <AdminTableHeaderCell>Name</AdminTableHeaderCell>
              <AdminTableHeaderCell>Email</AdminTableHeaderCell>
              <AdminTableHeaderCell>Role</AdminTableHeaderCell>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
              <AdminTableHeaderCell>Joined</AdminTableHeaderCell>
              <AdminTableHeaderCell />
            </AdminTableHead>
            <AdminTableBody>
              {items.map((user) => (
                <AdminTableRow key={user.id}>
                  <AdminTableCell>{user.name}</AdminTableCell>
                  <AdminTableCell>{user.email ?? user.phone ?? '—'}</AdminTableCell>
                  <AdminTableCell>
                    <Badge variant="muted">{user.role}</Badge>
                  </AdminTableCell>
                  <AdminTableCell>
                    <Badge variant={user.isActive ? 'success' : 'destructive'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </AdminTableCell>
                  <AdminTableCell>
                    {new Date(user.createdAt).toLocaleDateString('en-IN')}
                  </AdminTableCell>
                  <AdminTableCell>
                    <Button variant="outline" size="sm" onClick={() => openEdit(user)}>
                      Edit
                    </Button>
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>
          <AdminPagination meta={meta} onPageChange={setPage} />
        </>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Edit User">
        {selected && (
          <div className="space-y-4 p-5">
            <Typography variant="body-sm">{selected.name}</Typography>
            {updateMutation.isError && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {getErrorMessage(updateMutation.error)}
              </div>
            )}
            <div className="space-y-2">
              <Label>Role</Label>
              <select
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Active account
            </label>
            <Button className="w-full" onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
