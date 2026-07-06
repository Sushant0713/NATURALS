'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Icon, Input, Typography } from '@/components/ui';
import { sortOptions, type ProductFilterState, type SortOption } from '@/lib/products/types';

interface ProductToolbarProps {
  filters: ProductFilterState;
  total: number;
  start: number;
  end: number;
  onSearch: (query: string) => void;
  onSort: (sort: SortOption) => void;
}

export function ProductToolbar({
  filters,
  total,
  start,
  end,
  onSearch,
  onSort,
}: ProductToolbarProps) {
  const [query, setQuery] = useState(filters.query);

  useEffect(() => {
    setQuery(filters.query);
  }, [filters.query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== filters.query) {
        onSearch(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters.query, onSearch]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 sm:max-w-md">
        <Icon
          icon={Search}
          size="sm"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          aria-label="Search products"
        />
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <Typography variant="caption" className="whitespace-nowrap">
          {total === 0 ? 'No products' : `Showing ${start}–${end} of ${total}`}
        </Typography>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="sr-only">
            Sort products
          </label>
          <select
            id="sort"
            value={filters.sort}
            onChange={(e) => onSort(e.target.value as SortOption)}
            className="h-10 rounded-lg border border-border bg-surface px-3 font-accent text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
