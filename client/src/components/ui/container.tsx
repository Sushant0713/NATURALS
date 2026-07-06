import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      sm: 'max-w-container-sm',
      md: 'max-w-container-md',
      lg: 'max-w-container-lg',
      xl: 'max-w-container-xl',
      '2xl': 'max-w-container-2xl',
      full: 'max-w-full',
    },
    padding: {
      none: '',
      sm: 'px-4',
      md: 'px-4 sm:px-6',
      lg: 'px-4 sm:px-6 lg:px-8',
    },
  },
  defaultVariants: {
    size: 'xl',
    padding: 'lg',
  },
});

export interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, ...props }, ref) => (
    <div ref={ref} className={cn(containerVariants({ size, padding }), className)} {...props} />
  )
);
Container.displayName = 'Container';

export const Section = forwardRef<
  HTMLElement,
  HTMLAttributes<HTMLElement> & { containerSize?: ContainerProps['size'] }
>(({ className, children, containerSize, ...props }, ref) => (
  <section ref={ref} className={cn('py-12 md:py-16 lg:py-20', className)} {...props}>
    <Container size={containerSize}>{children}</Container>
  </section>
));
Section.displayName = 'Section';
