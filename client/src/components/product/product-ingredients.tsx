import { Typography } from '@/components/ui';
import type { ProductDetail } from '@/lib/products/product-detail-types';

interface ProductIngredientsProps {
  product: ProductDetail;
}

export function ProductIngredients({ product }: ProductIngredientsProps) {
  return (
    <section id="ingredients" className="scroll-mt-24">
      <Typography variant="h3" className="mb-2">
        Ingredients
      </Typography>
      <Typography variant="body-sm" className="mb-6 text-muted-foreground">
        100% natural ingredients — no hidden additives.
      </Typography>

      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <ul className="grid gap-2 sm:grid-cols-2">
          {product.ingredients.map((ingredient) => (
            <li
              key={ingredient}
              className="flex items-center gap-2 font-body text-sm text-foreground"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-secondary" />
              {ingredient}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
