'use client';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatCard } from '@/components/admin/stat-card';
import { Card, Typography } from '@/components/ui';
import { QueryError } from '@/components/query/query-error';
import { QueryLoading } from '@/components/query/query-loading';
import { formatINR } from '@/constants/pricing';
import { useAdminReportsQuery } from '@/hooks/queries';

export function ReportsSection() {
  const { data: report, isLoading, isError, error, refetch } = useAdminReportsQuery();

  if (isLoading) return <QueryLoading className="h-64" />;

  if (isError || !report) {
    return <QueryError error={error} onRetry={() => refetch()} title="Failed to load reports" />;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Reports"
        description={`Store summary generated ${new Date(report.generatedAt).toLocaleString('en-IN')}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Orders" value={report.orders.total} />
        <StatCard label="Total Revenue" value={formatINR(report.revenue.total)} hint={`${report.revenue.transactions} transactions`} />
        <StatCard label="Registered Users" value={report.users.total} />
        <StatCard label="Products" value={report.products.total} />
        <StatCard label="Reviews" value={report.reviews.total} />
        <StatCard label="Active Coupons" value={report.activeCoupons} />
      </div>

      <Card padding="lg">
        <Typography variant="h5" className="mb-2">Report Notes</Typography>
        <Typography variant="body-sm" className="text-muted-foreground">
          This summary aggregates all-time store metrics. Use Analytics for time-range trends and
          Orders for detailed transaction history.
        </Typography>
      </Card>
    </div>
  );
}
