import type { CatalogueProduct } from '@/constants/products';
import type { ProductCategorySlug } from '@/constants/categories';
import type { ProductFilterState, SortOption } from '@/lib/products/types';

function matchesQuery(product: CatalogueProduct, query: string): boolean {
  if (!query.trim()) return true;

  const q = query.toLowerCase().trim();
  const haystack = [
    product.name,
    product.shortDescription,
    product.category,
    ...product.features,
    ...product.healthBenefits,
    ...product.suitableFor,
    product.ageGuidance ?? '',
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
}

function sortProducts(products: CatalogueProduct[], sort: SortOption): CatalogueProduct[] {
  const sorted = [...products];

  switch (sort) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'bestseller':
      return sorted.sort((a, b) => {
        if (a.isBestseller === b.isBestseller) return a.name.localeCompare(b.name);
        return a.isBestseller ? -1 : 1;
      });
    case 'featured':
    default:
      return sorted.sort((a, b) => {
        if (a.isFeatured === b.isFeatured) {
          if (a.isBestseller === b.isBestseller) return a.name.localeCompare(b.name);
          return a.isBestseller ? -1 : 1;
        }
        return a.isFeatured ? -1 : 1;
      });
  }
}

export function filterProducts(
  products: CatalogueProduct[],
  filters: ProductFilterState,
  options?: { lockedCategory?: ProductCategorySlug }
): CatalogueProduct[] {
  let result = products;

  if (options?.lockedCategory) {
    result = result.filter((p) => p.category === options.lockedCategory);
  } else if (filters.category !== 'all') {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.organic) {
    result = result.filter((p) => p.isOrganic);
  }

  if (filters.glutenFree) {
    result = result.filter((p) => p.isGlutenFree);
  }

  if (filters.bestseller) {
    result = result.filter((p) => p.isBestseller);
  }

  result = result.filter((p) => matchesQuery(p, filters.query));

  return sortProducts(result, filters.sort);
}

export function paginateProducts<T>(items: T[], page: number, perPage: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;

  return {
    items: items.slice(start, start + perPage),
    total,
    totalPages,
    page: safePage,
    perPage,
    start: total === 0 ? 0 : start + 1,
    end: Math.min(start + perPage, total),
  };
}

export function parseFiltersFromSearchParams(
  params: URLSearchParams,
  lockedCategory?: ProductCategorySlug
): ProductFilterState {
  const categoryParam = params.get('category');
  const pageParam = parseInt(params.get('page') ?? '1', 10);

  return {
    query: params.get('q') ?? '',
    category: lockedCategory ?? (categoryParam as ProductFilterState['category']) ?? 'all',
    organic: params.get('organic') === '1',
    glutenFree: params.get('glutenFree') === '1',
    bestseller: params.get('bestseller') === '1',
    sort: (params.get('sort') as SortOption) ?? 'featured',
    page: Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam,
  };
}

export function filtersToSearchParams(
  filters: ProductFilterState,
  lockedCategory?: ProductCategorySlug
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.query) params.set('q', filters.query);
  if (!lockedCategory && filters.category !== 'all') params.set('category', filters.category);
  if (filters.organic) params.set('organic', '1');
  if (filters.glutenFree) params.set('glutenFree', '1');
  if (filters.bestseller) params.set('bestseller', '1');
  if (filters.sort !== 'featured') params.set('sort', filters.sort);
  if (filters.page > 1) params.set('page', String(filters.page));

  return params;
}
