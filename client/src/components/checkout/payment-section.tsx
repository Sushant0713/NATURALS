'use client';

import { CreditCard, ShieldCheck } from 'lucide-react';

import { Badge, Button, Card, Icon, Typography } from '@/components/ui';

interface PaymentSectionProps {
  total: number;
  cashfreeMode: 'sandbox' | 'production';
  isProcessing: boolean;
  onPay: () => void;
  disabled?: boolean;
}

export function PaymentSection({
  total,
  cashfreeMode,
  isProcessing,
  onPay,
  disabled,
}: PaymentSectionProps) {
  return (
    <Card padding="md" className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon icon={CreditCard} size="md" className="text-secondary" />
        <Typography variant="h5" as="h2">
          Payment
        </Typography>
        <Badge variant={cashfreeMode === 'sandbox' ? 'warning' : 'success'} size="sm">
          Cashfree {cashfreeMode === 'sandbox' ? 'Test' : 'Live'}
        </Badge>
      </div>

      <Typography variant="body-sm" className="text-muted-foreground">
        Pay securely via UPI, cards, net banking, or wallets powered by Cashfree Payments.
        {cashfreeMode === 'sandbox' && ' Test mode — no real charges.'}
      </Typography>

      <div className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2">
        <Icon icon={ShieldCheck} size="sm" className="text-success" />
        <Typography variant="caption">
          256-bit SSL encrypted · PCI DSS compliant
        </Typography>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={onPay}
        disabled={disabled || isProcessing}
      >
        {isProcessing ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
      </Button>
    </Card>
  );
}
