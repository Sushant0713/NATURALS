import { Badge, Card, Typography } from '@/components/ui';
import { StarRating } from '@/components/product/star-rating';
import type { ProductReview } from '@/lib/products/product-detail-types';

interface ProductReviewsProps {
  reviews: ProductReview[];
  averageRating: number;
  reviewCount: number;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function ProductReviews({ reviews, averageRating, reviewCount }: ProductReviewsProps) {
  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Typography variant="h3">Customer Reviews</Typography>
          <div className="mt-2 flex items-center gap-3">
            <StarRating rating={averageRating} size="lg" />
            <Typography variant="body-sm" className="text-muted-foreground">
              {averageRating.toFixed(1)} out of 5 · {reviewCount} reviews
            </Typography>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <Card key={review.id} padding="md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Typography variant="label">{review.author}</Typography>
                <Typography variant="caption" className="mt-0.5 block">
                  {formatDate(review.date)}
                </Typography>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StarRating rating={review.rating} size="sm" />
                {review.verified && (
                  <Badge variant="success" size="sm">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            <Typography variant="h6" as="h4" className="mt-3">
              {review.title}
            </Typography>
            <Typography variant="body-sm" className="mt-2 text-muted-foreground">
              {review.body}
            </Typography>
          </Card>
        ))}
      </div>
    </section>
  );
}
