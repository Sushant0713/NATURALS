'use client';

import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';

import { ProductCard } from '@/components/product/product-card';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Button, Icon, Section, Typography } from '@/components/ui';
import { routes } from '@/constants/routes';
import { useInView } from '@/hooks/use-in-view';

export function HeroSection() {
  const [sectionRef, isInView] = useInView({ threshold: 0.1 });
  const lines = [
    'Unlock a',
    'Healthier',
    '& Happier',
    'You!',
  ];

  let globalCharIndex = 0;

  return (
    <section ref={sectionRef} className="relative isolate z-0 h-screen min-h-[520px] w-full overflow-hidden supports-[height:100svh]:h-[100svh]">
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
      <div className="absolute bottom-2 sm:bottom-4 lg:bottom-8 right-8 sm:right-16 lg:right-32 z-20 select-none">
        <h2 className="text-white text-5xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-script leading-[1.15] text-center drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
          {lines.map((line, lineIdx) => (
            <span key={lineIdx} className="block whitespace-nowrap">
              {line.split('').map((char, charIdx) => {
                const index = globalCharIndex++;
                if (char === ' ') {
                  return <span key={charIdx}>&nbsp;</span>;
                }
                return (
                  <span
                    key={charIdx}
                    className={`inline-block ${isInView ? 'animate-drop-letter' : 'opacity-0'}`}
                    style={{
                      animationDelay: `${index * 0.08}s`,
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}

const HERO_ASSETS = {
  natural: '/heroes/hero-natural.svg',
  tree: '/heroes/cropped-tree.svg',
  premiumLeft: '/heroes/new.svg',
  featureIcons: [
    '/heroes/point1.svg',
    '/heroes/point2.svg',
    '/heroes/point3.svg',
    '/heroes/point4.svg',
    '/heroes/point5.svg',
  ],
} as const;

const BABY_SATVA_FEATURES = [
  {
    title: 'Easy to Digest',
    description: 'Gentle grains, suitable for babies from 6 months',
  },
  {
    title: 'Chemical-Free',
    description: 'No sugar, salt, preservatives, colors, or flavors',
  },
  {
    title: 'Immunity Boosting',
    description: 'Rich in iron, calcium, and fiber – great for bones and digestion',
  },
  {
    title: 'Organic Energy',
    description: 'Natural grains provide sustained energy for babies',
  },
  {
    title: 'Made with Love',
    description: 'Traditionally hand-crafted by rural women',
  },
] as const;

/** Native img — consistent SVG rendering in Chrome, Brave, Firefox, Safari, Edge */
function HeroSvgImage({
  src,
  className,
  alt = '',
  priority = false,
}: {
  src: string;
  className: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      aria-hidden={alt === ''}
      decoding="async"
      draggable={false}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
    />
  );
}

export function HeroNextSection() {
  const [sectionRef, isInView] = useInView({ threshold: 0.1 });

  return (
    <section ref={sectionRef} className="hero-next-section">
      <HeroSvgImage
        src={HERO_ASSETS.natural}
        alt="Boy eating healthy breakfast"
        priority
        className="hero-next-bg"
      />
      <HeroSvgImage src={HERO_ASSETS.tree} className="hero-next-tree" />

      {/* Tagline — centered on mobile, upper-right on desktop */}
      <div className="hero-next-tagline">
        <h2>
          <span className={`block ${isInView ? 'animate-slide-in-left' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            &ldquo;Healthy
          </span>
          <span className={`block ${isInView ? 'animate-slide-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
            Breakfast,
          </span>
          <span className={`block ${isInView ? 'animate-slide-in-left' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
            Happy
          </span>
          <span className={`block ${isInView ? 'animate-slide-in-right' : 'opacity-0'}`} style={{ animationDelay: '1.1s' }}>
            Lifestyle.&rdquo;
          </span>
        </h2>
        <div className="hero-next-tagline-divider" aria-hidden />
      </div>
    </section>
  );
}

export function BabySection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/bab y.svg"
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
  const [sectionRef, isInView] = useInView({ threshold: 0.15 });

  return (
    <section ref={sectionRef} className="premium-gradient-bg premium-section relative overflow-hidden">
      {/* Mobile decorative leaves */}
      <HeroSvgImage
        src="/flower_sketch_clean_transparent.svg"
        className="pointer-events-none absolute left-[-2rem] top-[-2.25rem] z-[2] block w-[9.5rem] rotate-[-12deg] opacity-60 md:hidden"
      />
      <HeroSvgImage
        src="/flower_sketch_clean_transparent.svg"
        className="pointer-events-none absolute right-[-2.5rem] top-[-2.75rem] z-[2] block w-[10.5rem] rotate-[168deg] opacity-60 md:hidden"
      />

      <HeroSvgImage
        src={HERO_ASSETS.premiumLeft}
        className={`premium-left-art transition-all duration-1000 ${
          isInView ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
        }`}
      />

      {/* Decorative art — desktop */}
      <HeroSvgImage
        src="/heroes/baby_satva.svg"
        className={`baby-satva-decor hidden transition-all duration-1000 md:block ${
          isInView ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      />

      {/* Baby Satva branding — text */}
      <div
        className={`baby-satva-branding relative z-20 flex shrink-0 select-none flex-col items-start px-6 pb-3 pt-6 text-left sm:px-10 md:absolute md:inset-0 md:justify-start md:pb-0 md:pt-12 lg:px-16 lg:pt-16 transition-all duration-1000 ${
          isInView ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}
      >
        <h2 className="font-accent text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
          <span style={{ color: '#5b2f1b' }}>BABY</span>
          <span style={{ color: '#ee8000' }}> SATVA</span>
        </h2>
        <div
          className="relative mt-4 h-[2px] w-full max-w-[18rem] sm:mt-5 sm:max-w-[24rem] md:max-w-[28rem]"
          style={{ backgroundColor: '#8a5a3a' }}
        >
          <svg
            viewBox="0 0 12 12"
            aria-hidden
            className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2"
          >
            <path
              fill="#e0913c"
              d="M6 10.2S1.2 7.1 1.2 4.4c0-1.5 1.2-2.6 2.6-2.6 1 0 1.9.5 2.2 1.3.3-.8 1.2-1.3 2.2-1.3 1.4 0 2.6 1.1 2.6 2.6C10.8 7.1 6 10.2 6 10.2z"
            />
          </svg>
        </div>
        <p
          className="mt-3 max-w-full font-heading text-sm font-semibold uppercase leading-snug tracking-[0.04em] sm:mt-4 sm:text-base md:text-lg lg:text-xl"
          style={{ color: '#5b2f1b' }}
        >
          Specially made for your baby&apos;s nutrition.
        </p>
      </div>

      {/* Decorative art — mobile (above points) */}
      <HeroSvgImage
        src="/heroes/baby_satva.svg"
        className={`baby-satva-decor-mobile block transition-all duration-1000 md:hidden ${
          isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      />

      {/* CTA shape — top right */}
      <div
        className={`baby-satva-cta absolute right-0 top-0 z-20 hidden h-[clamp(18rem,38vw,28rem)] w-[clamp(24rem,48vw,40rem)] select-none transition-all duration-1000 md:block ${
          isInView ? 'translate-x-0 translate-y-0 opacity-100' : 'translate-x-12 -translate-y-12 opacity-0'
        }`}
      >
        <HeroSvgImage
          src="/heroes/curveshape.svg"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="baby-satva-cta-content absolute inset-0 z-10 flex -translate-y-[24%] flex-col items-center justify-center px-8 pb-6 pt-6 text-center text-white">
          <p className="font-heading italic leading-tight text-[clamp(1rem,1.7vw,1.35rem)]">
            (Sprouted Ragi Cereal)
          </p>
          <p className="mt-1.5 font-heading font-semibold leading-tight text-[clamp(1.3rem,2.2vw,1.9rem)]">
            From 6 Months
            <br />
            Onwards
          </p>
          <div className="relative mt-4 h-[2px] w-12 bg-white/90">
            <svg
              viewBox="0 0 12 12"
              aria-hidden
              className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2"
            >
              <path
                fill="#ffffff"
                d="M6 10.2S1.2 7.1 1.2 4.4c0-1.5 1.2-2.6 2.6-2.6 1 0 1.9.5 2.2 1.3.3-.8 1.2-1.3 2.2-1.3 1.4 0 2.6 1.1 2.6 2.6C10.8 7.1 6 10.2 6 10.2z"
              />
            </svg>
          </div>
          <Link
            href="/categories/baby-satva"
            className="mt-5 inline-flex h-11 min-w-[9.5rem] items-center justify-center rounded-full font-accent text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#f0e2c4', color: '#4a2c1a' }}
          >
            Know more
          </Link>
        </div>
      </div>

      {/* Feature list — right side */}
      <ul className="baby-satva-features">
        {BABY_SATVA_FEATURES.map((feature, index) => (
          <li
            key={feature.title}
            className={`baby-satva-feature transition-all duration-700 ${
              isInView ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
            }`}
            style={{
              transitionDelay: `${index * 0.15}s`,
            }}
          >
            <span className="baby-satva-feature-icon" aria-hidden>
              <HeroSvgImage
                src={HERO_ASSETS.featureIcons[index]}
                className={`baby-satva-feature-icon-img${
                  HERO_ASSETS.featureIcons[index].endsWith('.svg')
                    ? ' baby-satva-feature-icon-img--svg'
                    : ''
                }`}
              />
            </span>
            <p className="baby-satva-feature-text">
              <span className="baby-satva-feature-title">{feature.title}:</span>
              <span className="baby-satva-feature-desc">{feature.description}</span>
            </p>
            <span className="baby-satva-feature-chevron" aria-hidden>
              <Icon icon={ChevronRight} size="sm" />
            </span>
          </li>
        ))}
      </ul>

    </section>
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
