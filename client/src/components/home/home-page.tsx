import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import {
  FeaturedProductsSection,
  HeroNextSection,
  HeroProductShowcase,
  HeroSection,
} from '@/components/home/hero-section';
import {
  InstagramGallerySection,
  NewsletterSection,
} from '@/components/home/newsletter-instagram-section';
import { OrganicBenefitsSection } from '@/components/home/organic-benefits-section';
import {
  TestimonialsSection,
} from '@/components/home/testimonials-recipes-section';
import { bestsellerProducts, featuredProducts } from '@/constants/products';

export function HomePage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <HeroSection />
        <HeroNextSection />
        <HeroProductShowcase />
        <FeaturedProductsSection title="Featured Products" products={featuredProducts} />
        <FeaturedProductsSection title="Best Sellers" products={bestsellerProducts} />
        <OrganicBenefitsSection />
        <TestimonialsSection />
        <NewsletterSection />
        <InstagramGallerySection />
      </main>
      <Footer />
    </>
  );
}
