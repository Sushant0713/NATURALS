export const productCategories = {
  BABY_SATVA: 'baby-satva',
  HERITAGE_FOODS: 'heritage-foods',
  BREAKFAST: 'breakfast',
  GRAINS_MEALS: 'grains-meals',
  FESTIVAL_SPECIAL: 'festival-special',
  GHEE: 'ghee',
} as const;

export type ProductCategorySlug = (typeof productCategories)[keyof typeof productCategories];

export const categoryLabels: Record<ProductCategorySlug, string> = {
  [productCategories.BABY_SATVA]: 'Baby Satva',
  [productCategories.HERITAGE_FOODS]: 'Heritage Foods',
  [productCategories.BREAKFAST]: 'Breakfast',
  [productCategories.GRAINS_MEALS]: 'Grains & Meals',
  [productCategories.FESTIVAL_SPECIAL]: 'Festival Special',
  [productCategories.GHEE]: 'Ghee',
};
