import { cn } from '@/lib/utils';

interface AdminTableProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminTable({ children, className }: AdminTableProps) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-border bg-surface', className)}>
      <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
    </div>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-border bg-muted/40">
      <tr>{children}</tr>
    </thead>
  );
}

export function AdminTableHeaderCell({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={cn('px-4 py-3 font-accent text-xs font-semibold uppercase tracking-wide text-muted-foreground', className)}>
      {children}
    </th>
  );
}

export function AdminTableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

export function AdminTableRow({ children }: { children: React.ReactNode }) {
  return <tr className="hover:bg-muted/30">{children}</tr>;
}

export function AdminTableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn('px-4 py-3 align-middle', className)}>{children}</td>;
}
