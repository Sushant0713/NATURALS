import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';

import { Container, Icon, Typography } from '@/components/ui';
import { brand } from '@/constants/brand';
import { categoryLabels, productCategories } from '@/constants/categories';
import { routes } from '@/constants/routes';

export function Footer() {
  return (
    <footer className="border-t border-border bg-heritage text-heritage-foreground">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href={routes.home} className="inline-block translate-y-2">
              <Image
                src="/logo-clean.png"
                alt={brand.name}
                width={240}
                height={96}
                className="h-20 md:h-24 w-auto object-contain brightness-0 invert"
                style={{ background: 'none' }}
              />
            </Link>
            <Typography variant="body-sm" className="text-white/80">
              {brand.tagline}
            </Typography>
            <Typography variant="caption" className="text-white/60">
              Traditionally hand-crafted organic and heritage foods from Nashik, Maharashtra.
            </Typography>
          </div>

          <div>
            <Typography variant="label" className="mb-4 block text-accent">
              Shop Categories
            </Typography>
            <ul className="space-y-2">
              {Object.values(productCategories).map((slug) => (
                <li key={slug}>
                  <Link
                    href={`${routes.categories}/${slug}`}
                    className="font-body text-sm text-white/80 transition-colors hover:text-accent"
                  >
                    {categoryLabels[slug]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Typography variant="label" className="mb-4 block text-accent">
              Quick Links
            </Typography>
            <ul className="space-y-2">
              <li>
                <Link href={routes.about} className="text-sm text-white/80 hover:text-accent">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#our-story" className="text-sm text-white/80 hover:text-accent">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#recipes" className="text-sm text-white/80 hover:text-accent">
                  Recipes
                </a>
              </li>
              <li>
                <Link href={routes.contact} className="text-sm text-white/80 hover:text-accent">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <Typography variant="label" className="mb-4 block text-accent">
              Contact Us
            </Typography>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${brand.contactPhone}`}
                  className="flex items-center gap-2 text-sm text-white/80 hover:text-accent"
                >
                  <Icon icon={Phone} size="sm" color="accent" />
                  {brand.contactPhone}
                </a>
              </li>
              <li>
                <a
                  href={brand.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/80 hover:text-accent"
                >
                  <Icon icon={Instagram} size="sm" color="accent" />
                  {brand.instagram}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/80">
                <Icon icon={MapPin} size="sm" color="accent" className="mt-0.5" />
                Nashik, Maharashtra
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <Icon icon={Mail} size="sm" color="accent" />
                For orders & enquiries
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center">
          <Typography variant="caption" className="text-white/50">
            © {new Date().getFullYear()} {brand.name}. All rights reserved. Nature&apos;s bounty in
            every grain!
          </Typography>
        </div>
      </Container>
    </footer>
  );
}
