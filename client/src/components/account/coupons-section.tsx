'use client';

import { useState } from 'react';
import { Copy } from 'lucide-react';

import { Badge, Button, Card, Icon, Typography } from '@/components/ui';
import { QueryError } from '@/components/query/query-error';
import { QueryLoading } from '@/components/query/query-loading';
import { useCouponsQuery } from '@/hooks/queries';

export function CouponsSection() {
  const { data: coupons = [], isLoading, isError, error, refetch } = useCouponsQuery();
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  if (isLoading) return <QueryLoading variant="cards" rows={2} />;

  if (isError) {
    return <QueryError error={error} onRetry={() => refetch()} title="Failed to load coupons" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h1" className="text-2xl sm:text-3xl">
          Available Coupons
        </Typography>
        <Typography variant="body-sm" className="mt-2 text-muted-foreground">
          Apply these codes at checkout to save on your order
        </Typography>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {coupons.map((coupon) => (
          <Card key={coupon.code} padding="md" variant="heritage">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Typography variant="label">{coupon.code}</Typography>
                <Typography variant="body-sm" className="mt-1 text-muted-foreground">
                  {coupon.description}
                </Typography>
                <Badge variant="secondary" size="sm" className="mt-2">
                  {coupon.type === 'PERCENTAGE' ? `${coupon.value}% off` : `₹${coupon.value} off`}
                </Badge>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => copyCode(coupon.code)}>
                <Icon icon={Copy} size="sm" />
              </Button>
            </div>
            {copied === coupon.code && (
              <Typography variant="caption" className="mt-2 block text-success">
                Copied!
              </Typography>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
