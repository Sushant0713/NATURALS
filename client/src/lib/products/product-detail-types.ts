import type { CatalogueProduct } from '@/constants/products';

export interface NutritionFact {
  label: string;
  value: string;
  dailyValue?: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified?: boolean;
}

export interface ProductDetail extends CatalogueProduct {
  gallery: string[];
  ingredients: string[];
  nutritionFacts: NutritionFact[];
  servingSize: string;
  faqs: ProductFAQ[];
  reviews: ProductReview[];
  averageRating: number;
  reviewCount: number;
}
