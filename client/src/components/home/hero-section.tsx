import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

import { ProductCard } from '@/components/product/product-card';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Button, Container, Icon, Section, Typography } from '@/components/ui';
import { brand } from '@/constants/brand';
import { heroProduct, heroSecondaryProduct } from '@/constants/products';
import { routes } from '@/constants/routes';
import { imageSizes } from '@/lib/seo/image';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden pt-16">
      <div className="absolute inset-0">
        <OptimizedImage
          src="/catalogue/page-02-full.png"
          alt="Raanjaai Naturals organic and heritage foods"
          fill
          priority
          withBlur={false}
          sizes={imageSizes.hero}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-heritage/90 via-heritage/70 to-heritage/30 dark:from-background/95 dark:via-background/80 dark:to-background/40" />
      </div>

      <Container className="relative flex min-h-[calc(90vh-4rem)] items-center py-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="animate-slide-up space-y-6">
            <Typography variant="overline" className="text-accent">
              Premium Organic & Heritage Foods
            </Typography>
            <Typography variant="h1" balance className="text-white dark:text-foreground">
              {brand.mission}
            </Typography>
            <Typography variant="tagline" className="text-accent">
              {brand.tagline}
            </Typography>
            <Typography variant="lead" className="max-w-lg text-white/85 dark:text-muted-foreground">
              Chemical-free, traditionally hand-crafted by rural women. From baby cereals to bilona
              ghee — nature&apos;s bounty in every grain.
            </Typography>
            <div className="flex flex-wrap gap-3">
              <Link href={routes.products}>
                <Button variant="secondary" size="lg">
                  Shop All Products
                  <Icon icon={ArrowRight} size="sm" />
                </Button>
              </Link>
              <a href={`tel:${brand.contactPhone}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white hover:bg-white hover:text-heritage dark:border-border dark:text-foreground"
                >
                  <Icon icon={Phone} size="sm" />
                  {brand.contactPhone}
                </Button>
              </a>
            </div>
          </div>

          <div className="animate-scale-in relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-accent/20 blur-2xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-8">
                  <div className="overflow-hidden rounded-2xl border-2 border-white/20 shadow-elevated">
                    <OptimizedImage
                      src={heroProduct.image}
                      alt={heroProduct.name}
                      width={300}
                      height={300}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-2xl border-2 border-white/20 shadow-elevated">
                    <OptimizedImage
                      src={heroSecondaryProduct.image}
                      alt={heroSecondaryProduct.name}
                      width={300}
                      height={300}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm dark:bg-surface/50">
                    <Typography variant="label" className="text-accent">
                      Featured
                    </Typography>
                    <Typography variant="h6" as="p" className="mt-1 text-white dark:text-foreground">
                      {heroProduct.name}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function HeroProductShowcase() {
  return (
    <Section className="bg-surface-muted py-16 md:py-20">
      <div className="mb-10 text-center">
        <Typography variant="overline">Hero Products</Typography>
        <Typography variant="h2" className="mt-2">
          Our Signature Collection
        </Typography>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[heroProduct, heroSecondaryProduct].map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
          >
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-square md:aspect-auto">
                <OptimizedImage
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-slow group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <Typography variant="overline">{product.ageGuidance ?? 'Premium'}</Typography>
                <Typography variant="h3" className="mt-2">
                  {product.name}
                </Typography>
                <Typography variant="body-sm" className="mt-3 text-muted-foreground">
                  {product.shortDescription}
                </Typography>
                <ul className="mt-4 space-y-1.5">
                  {product.healthBenefits.slice(0, 3).map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link href={`${routes.products}/${product.slug}`} className="mt-6">
                  <Button variant="primary">Explore Product</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function FeaturedProductsSection({
  title,
  products,
}: {
  title: string;
  products: typeof import('@/constants/products').catalogueProducts;
}) {
  return (
    <Section>
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <Typography variant="overline">Curated For You</Typography>
          <Typography variant="h2" className="mt-2">
            {title}
          </Typography>
        </div>
        <Link href={routes.products} className="hidden sm:block">
          <Button variant="ghost">
            View All
            <Icon icon={ArrowRight} size="sm" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Section>
  );
}
