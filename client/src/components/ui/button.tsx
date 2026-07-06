import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button font-accent text-sm font-medium transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90 active:scale-[0.98]',
        accent:
          'bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 active:scale-[0.98]',
        heritage:
          'bg-heritage text-heritage-foreground shadow-sm hover:bg-heritage/90 active:scale-[0.98]',
        outline:
          'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground',
        ghost: 'text-foreground hover:bg-muted hover:text-foreground',
        link: 'text-secondary underline-offset-4 hover:underline',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
      },
      size: {
        sm: 'h-8 px-3 text-xs [&_svg]:size-3.5',
        md: 'h-10 px-4 text-sm [&_svg]:size-4',
        lg: 'h-12 px-6 text-base [&_svg]:size-5',
        xl: 'h-14 px-8 text-lg [&_svg]:size-5',
        icon: 'h-10 w-10 [&_svg]:size-4',
        'icon-sm': 'h-8 w-8 [&_svg]:size-3.5',
        'icon-lg': 'h-12 w-12 [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);

Button.displayName = 'Button';
