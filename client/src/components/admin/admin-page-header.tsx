import { Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({ title, description, actions, className }: AdminPageHeaderProps) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-start justify-between gap-4', className)}>
      <div>
        <Typography variant="h1" className="text-2xl sm:text-3xl">
          {title}
        </Typography>
        {description && (
          <Typography variant="body-sm" className="mt-2 text-muted-foreground">
            {description}
          </Typography>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
