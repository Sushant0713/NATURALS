import { Card, Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
}

export function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <Card padding="md" className={cn('', className)}>
      <Typography variant="caption" className="text-muted-foreground">
        {label}
      </Typography>
      <Typography variant="h3" className="mt-1 tabular-nums">
        {value}
      </Typography>
      {hint && (
        <Typography variant="caption" className="mt-1 block text-muted-foreground">
          {hint}
        </Typography>
      )}
    </Card>
  );
}
