import { enrichProductDetail } from '@/lib/products/product-detail-data';
import { getProductBySlug } from '@/constants/products';

export function getProductDetail(slug: string) {
  const product = getProductBySlug(slug);
  if (!product) return null;
  return enrichProductDetail(product);
}
