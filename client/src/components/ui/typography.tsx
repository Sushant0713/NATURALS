import { cva, type VariantProps } from 'class-variance-authority';
import { createElement, forwardRef, type ElementType, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl',
      h2: 'font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl',
      h3: 'font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl',
      h4: 'font-heading text-xl font-semibold text-foreground',
      h5: 'font-accent text-lg font-semibold text-foreground',
      h6: 'font-accent text-base font-semibold text-foreground',
      body: 'font-body text-base leading-relaxed text-foreground',
      'body-sm': 'font-body text-sm leading-relaxed text-foreground',
      lead: 'font-body text-lg leading-relaxed text-muted-foreground sm:text-xl',
      caption: 'font-body text-xs text-muted-foreground',
      label: 'font-accent text-sm font-medium text-foreground',
      overline:
        'font-accent text-xs font-semibold uppercase tracking-widest text-secondary',
      quote:
        'border-l-4 border-accent pl-4 font-heading text-lg italic text-foreground',
      tagline:
        'font-heading text-lg italic text-heritage dark:text-accent sm:text-xl',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    balance: {
      true: 'text-balance',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'body',
    align: 'left',
    balance: false,
  },
});

const variantElementMap = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  'body-sm': 'p',
  lead: 'p',
  caption: 'span',
  label: 'span',
  overline: 'span',
  quote: 'blockquote',
  tagline: 'p',
} as const;

export interface TypographyProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: ElementType;
}

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'body', align, balance, as, children, ...props }, ref) => {
    const Component = as ?? variantElementMap[variant ?? 'body'];

    return createElement(
      Component,
      {
        ref,
        className: cn(typographyVariants({ variant, align, balance }), className),
        ...props,
      },
      children
    );
  }
);

Typography.displayName = 'Typography';

export { typographyVariants };
