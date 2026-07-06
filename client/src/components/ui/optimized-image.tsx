import Image, { type ImageProps } from 'next/image';

import { IMAGE_BLUR_DATA_URL } from '@/lib/seo/image';
import { cn } from '@/lib/utils';

export interface OptimizedImageProps extends ImageProps {
  /** Use for above-the-fold images (hero, LCP). Defaults to lazy. */
  priority?: boolean;
  withBlur?: boolean;
}

/**
 * Opinionated Next.js Image wrapper: lazy by default, optional blur placeholder,
 * AVIF/WebP via next.config image formats.
 */
export function OptimizedImage({
  priority = false,
  withBlur = true,
  loading,
  placeholder,
  blurDataURL,
  className,
  alt,
  ...props
}: OptimizedImageProps) {
  const useBlur = withBlur && !priority && placeholder !== 'empty';

  return (
    <Image
      alt={alt}
      priority={priority}
      loading={priority ? undefined : loading ?? 'lazy'}
      placeholder={useBlur ? 'blur' : placeholder}
      blurDataURL={useBlur ? (blurDataURL ?? IMAGE_BLUR_DATA_URL) : blurDataURL}
      className={cn(className)}
      {...props}
    />
  );
}
