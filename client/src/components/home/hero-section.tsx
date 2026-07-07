import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { ProductCard } from '@/components/product/product-card';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Button, Container, Icon, Section, Typography } from '@/components/ui';
import { heroProduct, heroSecondaryProduct } from '@/constants/products';
import { routes } from '@/constants/routes';

export function HeroSection() {
  return (
    <section className="relative h-[100svh] min-h-[520px] w-full overflow-hidden">
      {/* Progressive backdrop blur overlay covering the navbar area and extending deeply below */}
      <div
        className="absolute top-0 left-0 right-0 h-[45vh] min-h-[260px] z-10 pointer-events-none bg-gradient-to-b from-background/95 via-background/60 via-background/20 to-transparent"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0.3) 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0.3) 70%, transparent 100%)',
        }}
      />
      <OptimizedImage
        src="/main_hero.png"
        alt="Raanjaai Naturals — farmer harvesting organic crops"
        fill
        priority
        sizes="100vw"
        withBlur={false}
        className="object-cover object-center"
      />

      {/* Styled Callout Text Box on Bottom Right */}
      <div className="absolute bottom-2 sm:bottom-4 lg:bottom-8 right-8 sm:right-16 lg:right-32 z-20 select-none animate-scale-in">
        <h2 className="text-white text-5xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-script leading-[1.15] text-center drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
          Unlock a <br /> Healthier <br /> & Happier <br /> You!
        </h2>
      </div>
    </section>
  );
}

export function HeroNextSection() {
  return (
    <section
      className="relative w-full h-screen overflow-hidden flex items-stretch justify-center"
      style={{ backgroundColor: '#ffe3b9' }}
    >
      {/* Flower sketch — fills right side of hero, anchored bottom-right */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/flower_sketch_clean_transparent.svg"
          alt=""
          aria-hidden
          width={188}
          height={312}
          className="absolute bottom-0 right-0 block h-full w-auto min-h-full min-w-[42%] max-w-none object-cover object-bottom object-right transition-transform duration-normal"
          style={{ transform: 'translate(930px, 390px) scale(1.65)', transformOrigin: 'bottom right' }}
        />
      </div>

      <div
        className="absolute bottom-0 left-0 w-full h-[29vh] z-0"
        style={{
          backgroundImage: 'url(/table_wood_left.png), url(/table_wood_right.png), url(/table_wood.png)',
          backgroundRepeat: 'no-repeat, no-repeat, repeat-x',
          backgroundPosition: 'left bottom, right bottom, center bottom',
          backgroundSize: 'auto 158%, auto 158%, auto 158%',
          backgroundColor: '#d7af84',
        }}
      />
      <div className="relative z-10 w-full h-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 grid md:grid-cols-[52%_48%] gap-10 md:gap-16 items-stretch">
        {/* Left Column: Image wrapper (width: 100%, height: 100%) */}
        <div className="relative w-full h-full flex items-end justify-start select-none overflow-visible pl-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/boy_clean.svg"
            alt="Boy eating healthy breakfast"
            className="h-full w-auto object-bottom max-w-none block transition-transform duration-normal"
            style={{ transform: 'translate(-640px, -200px) scale(1.58)', transformOrigin: 'bottom center' }}
          />
        </div>

        {/* Right Column: Quote Text */}
        <div className="flex justify-center items-center text-center z-10 pb-12 md:pb-0 -mt-64 md:-mt-96 -ml-48 md:-ml-96">
          <h2
            className="font-heading font-bold tracking-wide leading-[1.3] text-center select-none"
            style={{
              color: '#603b28',
              fontSize: 'clamp(2.0rem, 4.5vw, 4.0rem)',
            }}
          >
            “HEALTHY <br />
            BREAKFAST, <br />
            HAPPY <br />
            LIFESTYLE.”
          </h2>
        </div>
      </div>
    </section>
  );
}

export function BabySection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/baby.svg"
        alt="Baby section background"
        className="absolute inset-0"
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'fill',
        }}
      />
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
