import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type InputHTMLAttributes, type LabelHTMLAttributes, type TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export const inputVariants = cva(
  'flex w-full rounded-lg border bg-surface px-3 py-2 font-body text-sm text-foreground transition-colors duration-fast file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-border hover:border-border-strong',
        error: 'border-destructive focus-visible:ring-destructive',
      },
      inputSize: {
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, error, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(inputVariants({ variant: error ? 'error' : variant, inputSize }), className)}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      inputVariants({ variant: error ? 'error' : 'default' }),
      'min-h-[100px] resize-y py-3',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('font-accent text-sm font-medium leading-none text-foreground', className)}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
  )
);
Label.displayName = 'Label';

export interface InputGroupProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function InputGroup({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: InputGroupProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
      {!error && hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
