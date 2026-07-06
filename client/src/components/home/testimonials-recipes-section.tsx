import Image from 'next/image';
import { Quote } from 'lucide-react';

import { Card, Icon, Section, Typography } from '@/components/ui';
import { recipes, testimonials } from '@/constants/home-content';

export function TestimonialsSection() {
  return (
    <Section>
      <div className="mb-10 text-center">
        <Typography variant="overline">Community</Typography>
        <Typography variant="h2" className="mt-2">
          What Families Love
        </Typography>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <Card
            key={item.role}
            variant="default"
            className="relative animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Icon icon={Quote} size="xl" color="accent" className="mb-4 opacity-60" />
            <Typography variant="body" className="italic text-muted-foreground">
              &ldquo;{item.quote}&rdquo;
            </Typography>
            <div className="mt-6 border-t border-border pt-4">
              <Typography variant="label">{item.role}</Typography>
              <Typography variant="caption" className="mt-1 block text-secondary">
                {item.product}
              </Typography>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function RecipesSection() {
  return (
    <Section id="recipes" className="bg-surface-muted">
      <div className="mb-10 text-center">
        <Typography variant="overline">From Our Kitchen</Typography>
        <Typography variant="h2" className="mt-2">
          Simple Recipes
        </Typography>
        <Typography variant="lead" className="mx-auto mt-3 max-w-2xl">
          Easy preparation guides straight from our product labels — wholesome meals in minutes.
        </Typography>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <Card key={recipe.title} padding="none" className="overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image src={recipe.image} alt={recipe.title} fill className="object-cover" sizes="25vw" />
            </div>
            <div className="p-5">
              <Typography variant="caption" className="text-secondary">
                {recipe.product} · {recipe.time}
              </Typography>
              <Typography variant="h5" as="h3" className="mt-1">
                {recipe.title}
              </Typography>
              <ol className="mt-3 space-y-1.5">
                {recipe.steps.map((step, i) => (
                  <li key={step} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="font-accent font-semibold text-secondary">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
