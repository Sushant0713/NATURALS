'use client';

import {
  Heart,
  Leaf,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';

import { ThemeToggle } from '@/components/providers/theme-toggle';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  Icon,
  Input,
  InputGroup,
  Section,
  Textarea,
  Typography,
} from '@/components/ui';
import { palette } from '@/design-system/tokens/colors';
import { brand } from '@/constants/brand';

const colorSwatches = [
  { name: 'White', hex: palette.white, className: 'bg-palette-white border border-border' },
  { name: 'Gold', hex: palette.gold, className: 'bg-palette-gold' },
  { name: 'Amber', hex: palette.amber, className: 'bg-palette-amber' },
  { name: 'Forest', hex: palette.forest, className: 'bg-palette-forest' },
  { name: 'Burgundy', hex: palette.burgundy, className: 'bg-palette-burgundy' },
];

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between">
          <Typography variant="h5" as="span">
            {brand.name} — Design System
          </Typography>
          <ThemeToggle />
        </Container>
      </header>

      <Section>
        <div className="animate-fade-in space-y-4">
          <Typography variant="overline">Phase 5</Typography>
          <Typography variant="h1" balance>
            Complete Design System
          </Typography>
          <Typography variant="tagline">{brand.tagline}</Typography>
          <Typography variant="lead" className="max-w-2xl">
            Playfair Display · Inter · Poppins — built for RAANJAAI NATURALS organic heritage
            brand.
          </Typography>
        </div>
      </Section>

      {/* Color Palette */}
      <Section className="bg-surface-muted py-12">
        <Typography variant="h2" className="mb-8">
          Color Palette
        </Typography>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {colorSwatches.map((color) => (
            <Card key={color.name} variant="default" padding="sm" className="animate-slide-up">
              <div className={`h-20 w-full rounded-lg ${color.className}`} />
              <Typography variant="label" className="mt-3 block">
                {color.name}
              </Typography>
              <Typography variant="caption">{color.hex}</Typography>
            </Card>
          ))}
        </div>
      </Section>

      {/* Typography */}
      <Section>
        <Typography variant="h2" className="mb-8">
          Typography
        </Typography>
        <div className="space-y-6">
          <Typography variant="h1">Heading 1 — Playfair Display</Typography>
          <Typography variant="h2">Heading 2 — Playfair Display</Typography>
          <Typography variant="h3">Heading 3 — Playfair Display</Typography>
          <Typography variant="h4">Heading 4 — Playfair Display</Typography>
          <Typography variant="h5">Heading 5 — Poppins</Typography>
          <Typography variant="h6">Heading 6 — Poppins</Typography>
          <Typography variant="lead">
            Lead text — Inter. Nature&apos;s bounty in every grain. Premium organic and heritage
            Indian foods.
          </Typography>
          <Typography variant="body">
            Body text — Inter. Traditionally hand-crafted by rural women, chemical-free and full of
            natural goodness.
          </Typography>
          <Typography variant="body-sm">Small body text — Inter.</Typography>
          <Typography variant="overline">Overline — Poppins</Typography>
          <Typography variant="tagline">Tagline — Playfair Display Italic</Typography>
          <Typography variant="quote">
            &ldquo;Healthy breakfast, happy lifestyle.&rdquo;
          </Typography>
          <Typography variant="caption">Caption text — Inter</Typography>
        </div>
      </Section>

      {/* Buttons */}
      <Section className="bg-surface-muted">
        <Typography variant="h2" className="mb-8">
          Buttons
        </Typography>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="heritage">Heritage</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
          <Button size="icon" variant="secondary" aria-label="Cart">
            <Icon icon={ShoppingCart} size="md" />
          </Button>
        </div>
      </Section>

      {/* Badges */}
      <Section>
        <Typography variant="h2" className="mb-8">
          Badges
        </Typography>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="heritage">Heritage</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">
            <Icon icon={Leaf} size="xs" /> Organic
          </Badge>
          <Badge variant="warning">Bestseller</Badge>
          <Badge variant="muted">Gluten Free</Badge>
        </div>
      </Section>

      {/* Cards */}
      <Section className="bg-surface-muted">
        <Typography variant="h2" className="mb-8">
          Cards
        </Typography>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card interactive className="animate-scale-in">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="success" size="sm">
                  Baby Satva
                </Badge>
              </div>
              <CardTitle>Sprouted Ragi Cereal</CardTitle>
              <CardDescription>From 6 months onwards · Easy to digest</CardDescription>
            </CardHeader>
            <CardContent>
              <Typography variant="body-sm">
                Rich in iron, calcium, and fiber. No sugar, salt, or preservatives.
              </Typography>
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm">Add to Cart</Button>
              <Button size="icon-sm" variant="ghost" aria-label="Wishlist">
                <Icon icon={Heart} size="sm" />
              </Button>
            </CardFooter>
          </Card>

          <Card variant="heritage">
            <CardHeader>
              <CardTitle>Heritage Foods</CardTitle>
              <CardDescription>Ancient grains & natural sweetness</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Icon icon={Sparkles} size="lg" color="heritage" />
              <Typography variant="body-sm">
                Jaggery sweetened, no maida, handmade with love.
              </Typography>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Bilona Desi Cow Ghee</CardTitle>
              <CardDescription>Traditional purity</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-accent/20">
                <Icon icon={Star} size="lg" color="secondary" />
              </div>
              <div>
                <Typography variant="label">100% Pure</Typography>
                <Typography variant="caption">Aromatic golden ghee</Typography>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Inputs */}
      <Section>
        <Typography variant="h2" className="mb-8">
          Inputs
        </Typography>
        <div className="grid max-w-xl gap-6">
          <InputGroup label="Full Name" htmlFor="name" required hint="As on your ID">
            <Input id="name" placeholder="Enter your name" />
          </InputGroup>
          <InputGroup label="Email" htmlFor="email" required>
            <Input id="email" type="email" placeholder="you@example.com" />
          </InputGroup>
          <InputGroup label="Phone" htmlFor="phone" error="Invalid phone number">
            <Input id="phone" error placeholder="10-digit mobile" />
          </InputGroup>
          <InputGroup label="Message" htmlFor="message">
            <Textarea id="message" placeholder="Your enquiry..." rows={4} />
          </InputGroup>
        </div>
      </Section>

      {/* Icons */}
      <Section className="bg-surface-muted">
        <Typography variant="h2" className="mb-8">
          Icons
        </Typography>
        <div className="flex flex-wrap gap-8">
          {[
            { icon: Leaf, color: 'primary' as const, label: 'Organic' },
            { icon: Heart, color: 'heritage' as const, label: 'Wishlist' },
            { icon: ShoppingCart, color: 'secondary' as const, label: 'Cart' },
            { icon: Truck, color: 'accent' as const, label: 'Delivery' },
            { icon: Star, color: 'warning' as const, label: 'Rating' },
            { icon: Sparkles, color: 'success' as const, label: 'Featured' },
          ].map(({ icon, color, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="flex size-12 items-center justify-center rounded-xl bg-surface shadow-card">
                <Icon icon={icon} size="xl" color={color} />
              </div>
              <Typography variant="caption">{label}</Typography>
            </div>
          ))}
        </div>
      </Section>

      {/* Spacing & Container */}
      <Section>
        <Typography variant="h2" className="mb-8">
          Spacing & Container
        </Typography>
        <Container size="md" className="rounded-xl border border-dashed border-border-strong p-6">
          <Typography variant="body-sm" className="text-center text-muted-foreground">
            Container (md) — responsive padding & max-width tokens
          </Typography>
        </Container>
        <div className="mt-6 flex gap-2">
          {[1, 2, 3, 4, 6, 8, 12].map((n) => (
            <div
              key={n}
              className="flex h-12 items-end rounded bg-primary/20"
              style={{ width: `${n * 8}px` }}
            >
              <Typography variant="caption" className="w-full text-center">
                {n}
              </Typography>
            </div>
          ))}
        </div>
      </Section>

      {/* Animations */}
      <Section className="bg-surface-muted">
        <Typography variant="h2" className="mb-8">
          Animations
        </Typography>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="animate-fade-in">
            <CardContent className="pt-6">
              <Typography variant="label">fade-in</Typography>
            </CardContent>
          </Card>
          <Card className="animate-slide-up">
            <CardContent className="pt-6">
              <Typography variant="label">slide-up</Typography>
            </CardContent>
          </Card>
          <Card className="animate-scale-in">
            <CardContent className="pt-6">
              <Typography variant="label">scale-in</Typography>
            </CardContent>
          </Card>
          <Card className="col-span-full overflow-hidden">
            <div className="shimmer-bg h-12 animate-shimmer rounded-lg" />
            <Typography variant="caption" className="mt-2 block">
              shimmer loading state
            </Typography>
          </Card>
        </div>
      </Section>

      <footer className="border-t border-border py-8">
        <Container>
          <Typography variant="caption" align="center" className="block">
            RAANJAAI NATURALS Design System — Phase 5 Complete
          </Typography>
        </Container>
      </footer>
    </div>
  );
}
