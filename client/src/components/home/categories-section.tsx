import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Icon, Section, Typography } from '@/components/ui';
import { categoryLabels, type ProductCategorySlug } from '@/constants/categories';
import { categoryShowcase } from '@/constants/home-content';
import { routes } from '@/constants/routes';
import { cn } from '@/lib/utils';

export function FeaturedCategoriesSection() {
  return (
    <Section className="bg-surface-muted">
      <div className="mb-10 text-center">
        <Typography variant="overline">Explore</Typography>
        <Typography variant="h2" className="mt-2">
          Featured Categories
        </Typography>
        <Typography variant="lead" className="mx-auto mt-3 max-w-2xl">
          From gentle baby nutrition to heritage snacks, wholesome breakfast, and ritual-grade ghee.
        </Typography>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryShowcase.map((cat, index) => {
          const slug = cat.slug as ProductCategorySlug;
          return (
            <Link
              key={cat.slug}
              href={`${routes.categories}/${cat.slug}`}
              className={cn(
                'group relative overflow-hidden rounded-2xl',
                index === 0 && 'sm:col-span-2 lg:col-span-2 lg:row-span-1'
              )}
            >
              <div className="relative aspect-[16/10] sm:aspect-[16/9]">
                <Image
                  src={cat.image}
                  alt={categoryLabels[slug]}
                  fill
                  className="object-cover transition-transform duration-slow group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-heritage/90 via-heritage/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <Typography variant="h4" as="h3" className="text-white">
                    {categoryLabels[slug]}
                  </Typography>
                  <Typography variant="body-sm" className="mt-1 text-white/80">
                    {cat.tagline}
                  </Typography>
                  <span className="mt-3 inline-flex items-center gap-1 font-accent text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    Shop Now
                    <Icon icon={ArrowRight} size="sm" color="accent" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
