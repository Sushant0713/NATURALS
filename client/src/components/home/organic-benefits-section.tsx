import { Flame, Heart, Leaf, Shield, Sparkles, Wheat } from 'lucide-react';

import { Card, Icon, Section, Typography } from '@/components/ui';
import { organicBenefits } from '@/constants/home-content';
import type { LucideIcon } from '@/components/ui/icon';

const iconMap: Record<string, LucideIcon> = {
  leaf: Leaf,
  heart: Heart,
  wheat: Wheat,
  sparkles: Sparkles,
  shield: Shield,
  flame: Flame,
};

export function OrganicBenefitsSection() {
  return (
    <Section>
      <div className="mb-10 text-center">
        <Typography variant="overline">Why Choose Us</Typography>
        <Typography variant="h2" className="mt-2">
          Organic Benefits
        </Typography>
        <Typography variant="lead" className="mx-auto mt-3 max-w-2xl">
          Every product is rooted in tradition, purity, and the wholesome power of ancient grains.
        </Typography>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {organicBenefits.map((benefit) => (
          <Card key={benefit.title} variant="muted">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Icon icon={iconMap[benefit.icon]} size="lg" color="primary" />
            </div>
            <Typography variant="h5" as="h3">
              {benefit.title}
            </Typography>
            <Typography variant="body-sm" className="mt-2 text-muted-foreground">
              {benefit.description}
            </Typography>
          </Card>
        ))}
      </div>
    </Section>
  );
}
