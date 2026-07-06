import { CheckCircle2, Leaf, Shield } from 'lucide-react';

import { Card, Icon, Typography } from '@/components/ui';
import type { ProductDetail } from '@/lib/products/product-detail-types';

interface ProductBenefitsProps {
  product: ProductDetail;
}

export function ProductBenefits({ product }: ProductBenefitsProps) {
  return (
    <section id="benefits" className="scroll-mt-24">
      <Typography variant="h3" className="mb-6">
        Benefits & Features
      </Typography>

      <div className="grid gap-6 md:grid-cols-2">
        <Card variant="muted" padding="md">
          <div className="mb-4 flex items-center gap-2">
            <Icon icon={Leaf} size="md" color="secondary" />
            <Typography variant="h5" as="h4">
              Health Benefits
            </Typography>
          </div>
          <ul className="space-y-3">
            {product.healthBenefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                {benefit}
              </li>
            ))}
          </ul>
        </Card>

        <Card variant="muted" padding="md">
          <div className="mb-4 flex items-center gap-2">
            <Icon icon={Shield} size="md" color="accent" />
            <Typography variant="h5" as="h4">
              Key Features
            </Typography>
          </div>
          <ul className="space-y-3">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-secondary" />
                {feature}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {product.suitableFor.length > 0 && (
        <div className="mt-6">
          <Typography variant="label" className="mb-3 block">
            Suitable For
          </Typography>
          <div className="flex flex-wrap gap-2">
            {product.suitableFor.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border bg-surface px-3 py-1 font-accent text-xs font-medium text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
