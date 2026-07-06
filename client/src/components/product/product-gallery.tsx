'use client';

import { useCallback, useState } from 'react';
import { ZoomIn } from 'lucide-react';

import { Button, Icon, Modal } from '@/components/ui';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { imageSizes } from '@/lib/seo/image';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const activeImage = images[activeIndex] ?? images[0];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }, []);

  return (
    <div className="space-y-3">
      <div
        className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface-muted"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <OptimizedImage
          src={activeImage}
          alt={productName}
          fill
          priority
          withBlur={false}
          sizes={imageSizes.productGallery}
          className={cn(
            'object-cover transition-transform duration-300',
            isHovering && 'scale-150'
          )}
          style={
            isHovering
              ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
              : undefined
          }
        />

        <Button
          variant="secondary"
          size="icon-sm"
          className="absolute bottom-3 right-3 opacity-100 shadow-card sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Open zoom view"
          onClick={() => setZoomOpen(true)}
        >
          <Icon icon={ZoomIn} size="sm" />
        </Button>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:size-20',
                index === activeIndex
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border opacity-70 hover:opacity-100'
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex}
            >
              <OptimizedImage
                src={src}
                alt=""
                fill
                sizes={imageSizes.thumbnail}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Modal open={zoomOpen} onClose={() => setZoomOpen(false)} className="sm:max-w-4xl">
        <div className="relative aspect-square w-full bg-surface-muted sm:aspect-[4/3]">
          <OptimizedImage
            src={activeImage}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-contain p-4"
            withBlur={false}
          />
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto border-t border-border p-4">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'relative size-14 shrink-0 overflow-hidden rounded-lg border-2',
                  index === activeIndex ? 'border-primary' : 'border-border'
                )}
              >
                <OptimizedImage src={src} alt="" fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
