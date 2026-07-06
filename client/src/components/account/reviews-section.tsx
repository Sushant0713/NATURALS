'use client';

import { useState } from 'react';

import { StarRating } from '@/components/product/star-rating';
import { Badge, Button, Card, Input, Label, Typography } from '@/components/ui';
import { QueryError } from '@/components/query/query-error';
import { QueryLoading } from '@/components/query/query-loading';
import { catalogueProducts } from '@/constants/products';
import { getErrorMessage } from '@/lib/api/api-error';
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useReviewsQuery,
} from '@/hooks/queries';

export function ReviewsSection() {
  const { data: reviews = [], isLoading, isError, error, refetch } = useReviewsQuery();
  const createMutation = useCreateReviewMutation();
  const deleteMutation = useDeleteReviewMutation();
  const [showForm, setShowForm] = useState(false);
  const [productId, setProductId] = useState(catalogueProducts[0]?.id ?? '');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const reviewedIds = new Set(reviews.map((r) => r.productId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { catalogueProductId: productId, rating, title, comment },
      {
        onSuccess: () => {
          setShowForm(false);
          setTitle('');
          setComment('');
        },
      }
    );
  };

  if (isLoading) return <QueryLoading />;

  if (isError) {
    return <QueryError error={error} onRetry={() => refetch()} title="Failed to load reviews" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Typography variant="h1" className="text-2xl sm:text-3xl">
            My Reviews
          </Typography>
          <Typography variant="body-sm" className="mt-2 text-muted-foreground">
            Share your experience with our products
          </Typography>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>Write Review</Button>
      </div>

      {showForm && (
        <Card padding="md">
          <form onSubmit={handleSubmit} className="space-y-4">
            {createMutation.isError && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {getErrorMessage(createMutation.error)}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <select
                id="product"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm"
              >
                {catalogueProducts
                  .filter((p) => !reviewedIds.has(p.id))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)}>
                    <StarRating rating={n <= rating ? 5 : 0} size="md" />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Review</Label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
            </div>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </Card>
      )}

      {reviews.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Typography variant="body-sm" className="text-muted-foreground">
            You haven&apos;t written any reviews yet.
          </Typography>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} padding="md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Typography variant="label">{review.productName}</Typography>
                  <StarRating rating={review.rating} size="sm" className="mt-1" />
                  {review.title && (
                    <Typography variant="h6" as="p" className="mt-2">
                      {review.title}
                    </Typography>
                  )}
                  {review.comment && (
                    <Typography variant="body-sm" className="mt-1 text-muted-foreground">
                      {review.comment}
                    </Typography>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={review.isApproved ? 'success' : 'muted'} size="sm">
                      {review.isApproved ? 'Published' : 'Pending'}
                    </Badge>
                    <Typography variant="caption">
                      {new Date(review.createdAt).toLocaleDateString('en-IN')}
                    </Typography>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(review.id)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
