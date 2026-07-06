export const productCategories = {
  BABY_SATVA: 'baby-satva',
  HERITAGE_FOODS: 'heritage-foods',
  BREAKFAST: 'breakfast',
  GRAINS_MEALS: 'grains-meals',
  FESTIVAL_SPECIAL: 'festival-special',
  GHEE: 'ghee',
} as const;

export type ProductCategorySlug = (typeof productCategories)[keyof typeof productCategories];
