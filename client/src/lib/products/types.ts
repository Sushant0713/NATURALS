import type { ProductCategorySlug } from '@/constants/categories';

export type SortOption = 'featured' | 'bestseller' | 'name-asc' | 'name-desc';

export interface ProductFilterState {
  query: string;
  category: ProductCategorySlug | 'all';
  organic: boolean;
  glutenFree: boolean;
  bestseller: boolean;
  sort: SortOption;
  page: number;
}

export const DEFAULT_PER_PAGE = 12;

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'bestseller', label: 'Best Sellers' },
  { value: 'name-asc', label: 'Name (A–Z)' },
  { value: 'name-desc', label: 'Name (Z–A)' },
];

export const defaultFilters: ProductFilterState = {
  query: '',
  category: 'all',
  organic: false,
  glutenFree: false,
  bestseller: false,
  sort: 'featured',
  page: 1,
};
