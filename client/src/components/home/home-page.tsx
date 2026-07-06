import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { FeaturedCategoriesSection } from '@/components/home/categories-section';
import {
  FeaturedProductsSection,
  HeroProductShowcase,
  HeroSection,
} from '@/components/home/hero-section';
import {
  InstagramGallerySection,
  NewsletterSection,
} from '@/components/home/newsletter-instagram-section';
import { OrganicBenefitsSection } from '@/components/home/organic-benefits-section';
import { OurStorySection } from '@/components/home/our-story-section';
import {
  RecipesSection,
  TestimonialsSection,
} from '@/components/home/testimonials-recipes-section';
import { bestsellerProducts, featuredProducts } from '@/constants/products';

export function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HeroProductShowcase />
        <FeaturedCategoriesSection />
        <FeaturedProductsSection title="Featured Products" products={featuredProducts} />
        <FeaturedProductsSection title="Best Sellers" products={bestsellerProducts} />
        <OrganicBenefitsSection />
        <OurStorySection />
        <TestimonialsSection />
        <RecipesSection />
        <NewsletterSection />
        <InstagramGallerySection />
      </main>
      <Footer />
    </>
  );
}
