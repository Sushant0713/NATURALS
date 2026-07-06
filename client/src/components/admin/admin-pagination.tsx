'use client';

import { Button, Typography } from '@/components/ui';
import type { PaginatedMeta } from '@/types/admin';

interface AdminPaginationProps {
  meta: PaginatedMeta;
  onPageChange: (page: number) => void;
}

export function AdminPagination({ meta, onPageChange }: AdminPaginationProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <Typography variant="caption" className="text-muted-foreground">
        Page {meta.page} of {meta.totalPages} · {meta.total} total
      </Typography>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
