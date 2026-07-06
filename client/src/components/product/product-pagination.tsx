'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button, Icon } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function ProductPagination({
  page,
  totalPages,
  onPageChange,
  className,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Product pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <Button
        variant="outline"
        size="icon-sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <Icon icon={ChevronLeft} size="sm" />
      </Button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? 'primary' : 'ghost'}
            size="sm"
            className="min-w-9"
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon-sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <Icon icon={ChevronRight} size="sm" />
      </Button>
    </nav>
  );
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1];

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('...');

  pages.push(total);
  return pages;
}
