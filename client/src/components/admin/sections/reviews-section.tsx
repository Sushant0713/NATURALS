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
import { Badge, Button, Card, Typography } from '@/components/ui';
import { QueryError } from '@/components/query/query-error';
import { QueryLoading } from '@/components/query/query-loading';
import {
  useAdminReviewsQuery,
  useDeleteAdminReviewMutation,
  useUpdateAdminReviewMutation,
} from '@/hooks/queries';

export function ReviewsSection() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const approved = filter === 'all' ? undefined : filter === 'approved';
  const { data, isLoading, isError, error, refetch } = useAdminReviewsQuery(page, approved);
  const updateMutation = useUpdateAdminReviewMutation(page, approved);
  const deleteMutation = useDeleteAdminReviewMutation();

  const items = data?.items ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Reviews" description="Moderate product reviews" />

      <div className="flex gap-2">
        {(['all', 'pending', 'approved'] as const).map((f) => (
          <Button key={f} variant={filter === f ? 'primary' : 'outline'} size="sm" onClick={() => { setFilter(f); setPage(1); }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <QueryLoading />
      ) : isError ? (
        <QueryError error={error} onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Typography variant="body-sm" className="text-muted-foreground">No reviews found</Typography>
        </Card>
      ) : (
        <>
          <AdminTable>
            <AdminTableHead>
              <AdminTableHeaderCell>User</AdminTableHeaderCell>
              <AdminTableHeaderCell>Rating</AdminTableHeaderCell>
              <AdminTableHeaderCell>Comment</AdminTableHeaderCell>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
              <AdminTableHeaderCell />
            </AdminTableHead>
            <AdminTableBody>
              {items.map((review) => (
                <AdminTableRow key={review.id}>
                  <AdminTableCell>{review.userName}</AdminTableCell>
                  <AdminTableCell>{'★'.repeat(review.rating)}</AdminTableCell>
                  <AdminTableCell className="max-w-xs truncate">{review.comment ?? review.title ?? '—'}</AdminTableCell>
                  <AdminTableCell>
                    <Badge variant={review.isApproved ? 'success' : 'warning'}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                  </AdminTableCell>
                  <AdminTableCell>
                    <div className="flex gap-2">
                      {!review.isApproved && (
                        <Button variant="outline" size="sm" onClick={() => updateMutation.mutate({ id: review.id, isApproved: true })} disabled={updateMutation.isPending}>
                          Approve
                        </Button>
                      )}
                      {review.isApproved && (
                        <Button variant="outline" size="sm" onClick={() => updateMutation.mutate({ id: review.id, isApproved: false })} disabled={updateMutation.isPending}>
                          Unapprove
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(review.id)} disabled={deleteMutation.isPending}>
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
    </div>
  );
}
