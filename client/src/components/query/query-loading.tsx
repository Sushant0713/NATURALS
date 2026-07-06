import { cn } from '@/lib/utils';

interface QueryLoadingProps {
  className?: string;
  rows?: number;
  variant?: 'block' | 'list' | 'cards';
}

export function QueryLoading({ className, rows = 3, variant = 'block' }: QueryLoadingProps) {
  if (variant === 'list') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={cn('grid grid-cols-2 gap-4 md:grid-cols-3', className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('h-40 animate-pulse rounded-xl bg-muted', className)} aria-busy="true" />
  );
}
