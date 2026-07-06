import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
};

export function StarRating({ rating, max = 5, size = 'sm', className }: StarRatingProps) {
  return (
    <div className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;

        return (
          <Star
            key={i}
            className={cn(
              sizeMap[size],
              filled || half ? 'fill-warning text-warning' : 'text-muted-foreground/30'
            )}
          />
        );
      })}
    </div>
  );
}
