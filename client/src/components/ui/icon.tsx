import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export const iconVariants = cva('shrink-0', {
  variants: {
    size: {
      xs: 'size-3',
      sm: 'size-3.5',
      md: 'size-4',
      lg: 'size-5',
      xl: 'size-6',
      '2xl': 'size-8',
    },
    color: {
      inherit: 'text-inherit',
      primary: 'text-primary',
      secondary: 'text-secondary',
      accent: 'text-accent',
      heritage: 'text-heritage',
      muted: 'text-muted-foreground',
      success: 'text-success',
      warning: 'text-warning',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'inherit',
  },
});

export interface IconProps extends VariantProps<typeof iconVariants> {
  icon: LucideIcon;
  className?: string;
  strokeWidth?: number;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
}

export function Icon({
  icon: LucideIconComponent,
  size,
  color,
  className,
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true,
  'aria-label': ariaLabel,
}: IconProps) {
  return (
    <LucideIconComponent
      className={cn(iconVariants({ size, color }), className)}
      strokeWidth={strokeWidth}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    />
  );
}

export type { LucideIcon };
