'use client';

import { Button, Typography } from '@/components/ui';
import { getErrorMessage } from '@/lib/api/api-error';

interface QueryErrorProps {
  error: unknown;
  onRetry?: () => void;
  title?: string;
  className?: string;
}

export function QueryError({
  error,
  onRetry,
  title = 'Failed to load data',
  className,
}: QueryErrorProps) {
  return (
    <div
      className={`rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-6 text-center ${className ?? ''}`}
      role="alert"
    >
      <Typography variant="h5" as="p" className="text-destructive">
        {title}
      </Typography>
      <Typography variant="body-sm" className="mt-2 text-muted-foreground">
        {getErrorMessage(error)}
      </Typography>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
