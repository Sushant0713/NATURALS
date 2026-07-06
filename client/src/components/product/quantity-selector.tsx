'use client';

import { Minus, Plus } from 'lucide-react';

import { Button, Icon } from '@/components/ui';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantitySelectorProps) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div className={cn('inline-flex items-center rounded-lg border border-border', className)}>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={decrease}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="rounded-r-none"
      >
        <Icon icon={Minus} size="sm" />
      </Button>
      <span
        className="flex h-8 min-w-10 items-center justify-center border-x border-border px-2 font-accent text-sm font-semibold tabular-nums"
        aria-live="polite"
        aria-label={`Quantity: ${value}`}
      >
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={increase}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="rounded-l-none"
      >
        <Icon icon={Plus} size="sm" />
      </Button>
    </div>
  );
}
