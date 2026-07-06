'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { catalogueProducts } from '@/constants/products';
import type { ProductCategorySlug } from '@/constants/categories';
import {
  filterProducts,
  filtersToSearchParams,
  paginateProducts,
  parseFiltersFromSearchParams,
} from '@/lib/products/filter-products';
import { DEFAULT_PER_PAGE, type ProductFilterState } from '@/lib/products/types';

export function useProductListing(lockedCategory?: ProductCategorySlug) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFiltersFromSearchParams(searchParams, lockedCategory),
    [searchParams, lockedCategory]
  );

  const filtered = useMemo(
    () => filterProducts(catalogueProducts, filters, { lockedCategory }),
    [filters, lockedCategory]
  );

  const pagination = useMemo(
    () => paginateProducts(filtered, filters.page, DEFAULT_PER_PAGE),
    [filtered, filters.page]
  );

  const updateFilters = useCallback(
    (patch: Partial<ProductFilterState>, resetPage = true) => {
      const next: ProductFilterState = {
        ...filters,
        ...patch,
        page: resetPage ? 1 : (patch.page ?? filters.page),
      };

      const params = filtersToSearchParams(next, lockedCategory);
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [filters, lockedCategory, pathname, router]
  );

  const setPage = useCallback(
    (page: number) => {
      updateFilters({ page }, false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [updateFilters]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    if (!lockedCategory && filters.category !== 'all') count++;
    if (filters.organic) count++;
    if (filters.glutenFree) count++;
    if (filters.bestseller) count++;
    return count;
  }, [filters, lockedCategory]);

  return {
    filters,
    filtered,
    pagination,
    updateFilters,
    setPage,
    clearFilters,
    activeFilterCount,
  };
}
