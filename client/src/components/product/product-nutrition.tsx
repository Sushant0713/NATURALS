import { Typography } from '@/components/ui';
import type { ProductDetail } from '@/lib/products/product-detail-types';

interface ProductNutritionProps {
  product: ProductDetail;
}

export function ProductNutrition({ product }: ProductNutritionProps) {
  return (
    <section id="nutrition" className="scroll-mt-24">
      <Typography variant="h3" className="mb-2">
        Nutrition Facts
      </Typography>
      <Typography variant="body-sm" className="mb-6 text-muted-foreground">
        Approximate values per serving. Actual values may vary slightly by batch.
      </Typography>

      <div className="mx-auto max-w-md overflow-hidden rounded-xl border-2 border-foreground">
        <div className="border-b-8 border-foreground bg-surface px-4 py-3">
          <Typography variant="h4" as="p" className="text-lg font-bold">
            Nutrition Facts
          </Typography>
          <Typography variant="caption" className="mt-1 block">
            Serving size: {product.servingSize}
          </Typography>
        </div>

        <div className="bg-surface px-4 py-2">
          <div className="border-b-4 border-foreground py-2">
            <Typography variant="label" className="text-sm">
              Amount per serving
            </Typography>
          </div>

          <table className="w-full text-sm">
            <tbody>
              {product.nutritionFacts.map((fact, index) => (
                <tr
                  key={fact.label}
                  className={index < product.nutritionFacts.length - 1 ? 'border-b border-border' : ''}
                >
                  <td className="py-2 pr-4 font-medium">{fact.label}</td>
                  <td className="py-2 text-right font-semibold tabular-nums">{fact.value}</td>
                  {fact.dailyValue && (
                    <td className="py-2 pl-4 text-right text-muted-foreground tabular-nums">
                      {fact.dailyValue}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {product.nutritionFacts.some((f) => f.dailyValue) && (
            <Typography variant="caption" className="mt-3 block border-t border-border pt-2">
              * Percent Daily Values are based on a 2,000 calorie diet.
            </Typography>
          )}
        </div>
      </div>
    </section>
  );
}
