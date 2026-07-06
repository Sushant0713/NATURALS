'use client';

import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { useState } from 'react';

import { Button, Container, Icon, Input, Section, Typography } from '@/components/ui';
import { brand } from '@/constants/brand';
import { instagramPosts } from '@/constants/home-content';

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  return (
    <Section className="bg-primary py-16 text-primary-foreground md:py-20">
      <Container className="text-center">
        <Typography variant="overline" className="text-accent">
          Stay Connected
        </Typography>
        <Typography variant="h2" className="mt-2 text-primary-foreground">
          Elevate Your Lifestyle Today!
        </Typography>
        <Typography variant="lead" className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
          Get updates on new products, seasonal offers, and wholesome recipes from Raanjaai Naturals.
        </Typography>
        <form
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setEmail('');
          }}
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-0 bg-white/10 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-accent"
          />
          <Button type="submit" variant="secondary" size="lg" className="shrink-0">
            Subscribe
          </Button>
        </form>
      </Container>
    </Section>
  );
}

export function InstagramGallerySection() {
  return (
    <Section>
      <div className="mb-10 flex flex-col items-center text-center">
        <Typography variant="overline">Follow Us</Typography>
        <Typography variant="h2" className="mt-2">
          Instagram Gallery
        </Typography>
        <a
          href={brand.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 font-accent text-sm font-medium text-secondary hover:underline"
        >
          <Icon icon={Instagram} size="sm" color="secondary" />
          {brand.instagram}
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {instagramPosts.map((post, index) => (
          <a
            key={post.alt}
            href={brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-xl"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Image
              src={post.image}
              alt={post.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-slow group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-heritage/0 transition-colors group-hover:bg-heritage/50">
              <Icon
                icon={Instagram}
                size="xl"
                className="text-white opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
