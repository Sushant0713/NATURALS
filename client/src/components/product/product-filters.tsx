'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

import { Button, Icon, Label, Typography } from '@/components/ui';
import {
  categoryLabels,
  productCategories,
  type ProductCategorySlug,
} from '@/constants/categories';
import type { ProductFilterState } from '@/lib/products/types';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  filters: ProductFilterState;
  onChange: (patch: Partial<ProductFilterState>) => void;
  onClear: () => void;
  activeCount: number;
  lockedCategory?: ProductCategorySlug;
  className?: string;
}

export function ProductFilters({
  filters,
  onChange,
  onClear,
  activeCount,
  lockedCategory,
  className,
}: ProductFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h6" as="h3">
          Filters
        </Typography>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="font-accent text-xs font-medium text-secondary hover:underline"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {!lockedCategory && (
        <div className="space-y-2">
          <Label>Category</Label>
          <div className="flex flex-col gap-1">
            <FilterRadio
              label="All Categories"
              checked={filters.category === 'all'}
              onChange={() => onChange({ category: 'all' })}
            />
            {Object.values(productCategories).map((slug) => (
              <FilterRadio
                key={slug}
                label={categoryLabels[slug]}
                checked={filters.category === slug}
                onChange={() => onChange({ category: slug })}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Product Tags</Label>
        <div className="flex flex-col gap-2">
          <FilterCheckbox
            label="Organic"
            checked={filters.organic}
            onChange={(organic) => onChange({ organic })}
          />
          <FilterCheckbox
            label="Gluten Free"
            checked={filters.glutenFree}
            onChange={(glutenFree) => onChange({ glutenFree })}
          />
          <FilterCheckbox
            label="Bestseller"
            checked={filters.bestseller}
            onChange={(bestseller) => onChange({ bestseller })}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="outline"
        className="w-full lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Icon icon={SlidersHorizontal} size="sm" />
        Filters
        {activeCount > 0 && (
          <span className="ml-1 rounded-full bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
            {activeCount}
          </span>
        )}
      </Button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-heritage/50 backdrop-blur-sm"
            aria-label="Close filters"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(100%,320px)] overflow-y-auto bg-surface p-5 shadow-elevated">
            <div className="mb-4 flex justify-end">
              <Button variant="ghost" size="icon-sm" onClick={() => setMobileOpen(false)}>
                <Icon icon={X} size="md" />
              </Button>
            </div>
            {content}
            <Button className="mt-6 w-full" onClick={() => setMobileOpen(false)}>
              Show Results
            </Button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden rounded-xl border border-border bg-surface p-5 lg:block lg:sticky lg:top-24 lg:self-start',
          className
        )}
      >
        {content}
      </aside>
    </>
  );
}

function FilterRadio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted">
      <input type="radio" checked={checked} onChange={onChange} className="accent-primary" />
      {label}
    </label>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-primary"
      />
      {label}
    </label>
  );
}
