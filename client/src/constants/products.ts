import { productCategories, type ProductCategorySlug } from '@/constants/categories';

export interface CatalogueProduct {
  id: string;
  slug: string;
  name: string;
  category: ProductCategorySlug;
  shortDescription: string;
  features: string[];
  healthBenefits: string[];
  suitableFor: string[];
  ageGuidance?: string;
  image: string;
  isBestseller?: boolean;
  isFeatured?: boolean;
  isHero?: boolean;
  isOrganic?: boolean;
  isGlutenFree?: boolean;
}

const img = (path: string) => `/catalogue/${path}`;

export const catalogueProducts: CatalogueProduct[] = [
  // Baby Satva
  {
    id: 'sprouted-ragi-cereal',
    slug: 'sprouted-ragi-cereal',
    name: 'Sprouted Ragi Cereal (Ragi Satva)',
    category: productCategories.BABY_SATVA,
    shortDescription: 'Gentle sprouted ragi porridge — from 6 months onwards.',
    ageGuidance: 'From 6 Months Onwards',
    features: [
      'Easy to digest — gentle grains for babies',
      'Chemical-free — no sugar, salt, preservatives, colors, or flavors',
      'Made with love — traditionally hand-crafted by rural women',
    ],
    healthBenefits: [
      'Rich in iron, calcium, and fiber',
      'Great for bones and digestion',
      'Immunity boosting organic energy',
    ],
    suitableFor: ['Babies from 6 months', 'Parents seeking chemical-free nutrition'],
    image: img('page-04-img-01.jpeg'),
    isHero: true,
    isFeatured: true,
    isBestseller: true,
    isOrganic: true,
  },
  {
    id: 'rice-lentil-cereal',
    slug: 'rice-lentil-cereal',
    name: 'Rice & Lentil Cereal (Khichdi Satva)',
    category: productCategories.BABY_SATVA,
    shortDescription: 'Balanced rice and lentil cereal — from 7 months onwards.',
    ageGuidance: 'From 7 Months Onwards',
    features: [
      'Easy to digest gentle grains',
      'No artificial flavour, colour, or preservative',
      '100% natural baby nutrition',
    ],
    healthBenefits: [
      'Rich in protein and carbohydrates',
      'Complete balanced food for babies',
      'Good for digestion and immunity',
    ],
    suitableFor: ['Babies from 7 months', 'Growing infants needing balanced meals'],
    image: img('page-04-img-02.jpeg'),
    isFeatured: true,
    isOrganic: true,
  },
  {
    id: 'pulse-based-cereal',
    slug: 'pulse-based-cereal',
    name: 'Pulse-based Cereal (Pulses Satva)',
    category: productCategories.BABY_SATVA,
    shortDescription: 'Nutritious pulses mix — from 9 months onwards.',
    ageGuidance: 'From 9 Months Onwards',
    features: [
      'Nutritious pulses mix soup',
      'No artificial flavour, colour, or preservative',
      'Traditionally hand-crafted',
    ],
    healthBenefits: [
      'High in protein and fiber',
      'Keeps babies active and healthy',
      'Boosts immunity and aids digestion',
    ],
    suitableFor: ['Babies from 9 months', 'Parents introducing diverse grains'],
    image: img('page-04-img-03.jpeg'),
    isFeatured: true,
    isOrganic: true,
  },

  // Heritage Foods
  {
    id: 'dryfruit-laddu',
    slug: 'dryfruit-laddu',
    name: 'Dryfruit Laddu',
    category: productCategories.HERITAGE_FOODS,
    shortDescription: 'Ancient grains with almonds, ghee, and jaggery sweetness.',
    features: ['Sweetened with jaggery, not sugar', 'Healthy fats and protein', 'Pure and handmade'],
    healthBenefits: ['Bones and energy — rich in iron and calcium', 'Brain development support'],
    suitableFor: ['Kids, adults, and elders', 'School, tea-time, guilt-free snacking'],
    image: img('page-05-img-02.jpeg'),
    isBestseller: true,
    isFeatured: true,
    isOrganic: true,
  },
  {
    id: 'jowar-namkeen',
    slug: 'jowar-namkeen',
    name: 'Jowar Namkeen',
    category: productCategories.HERITAGE_FOODS,
    shortDescription: 'Crunchy jowar namkeen — no maida, no preservatives.',
    features: ['Ancient grain blend', 'No maida, no preservatives', 'Handmade with care'],
    healthBenefits: ['Natural sustained energy', 'Wholesome snacking'],
    suitableFor: ['All age groups', 'Tea-time and school snacks'],
    image: img('page-05-img-03.jpeg'),
    isOrganic: true,
  },
  {
    id: 'methi-dink-laddu',
    slug: 'methi-dink-laddu',
    name: 'Methi Dink Laddu',
    category: productCategories.HERITAGE_FOODS,
    shortDescription: 'Traditional methi dink laddu with natural sweetness.',
    features: ['Jaggery sweetened', 'Pure and handmade', 'No preservatives'],
    healthBenefits: ['Iron and calcium rich', 'Traditional wellness snack'],
    suitableFor: ['Kids, adults, and elders', 'Postpartum and seasonal wellness'],
    image: img('page-05-img-04.jpeg'),
    isOrganic: true,
  },
  {
    id: 'jowar-sev',
    slug: 'jowar-sev',
    name: 'Jowar Sev',
    category: productCategories.HERITAGE_FOODS,
    shortDescription: 'Crispy jowar sev — guilt-free heritage snacking.',
    features: ['Ancient grains', 'No maida', 'Handcrafted'],
    healthBenefits: ['Light yet energizing', 'Wholesome alternative to fried snacks'],
    suitableFor: ['Kids and adults', 'Tea-time'],
    image: img('page-05-img-05.jpeg'),
    isOrganic: true,
  },
  {
    id: 'ragi-sev',
    slug: 'ragi-sev',
    name: 'Ragi Sev',
    category: productCategories.HERITAGE_FOODS,
    shortDescription: 'Nutritious ragi sev rich in calcium and iron.',
    features: ['Ragi-based', 'No preservatives', 'Handmade'],
    healthBenefits: ['Calcium and iron rich', 'Supports bone health'],
    suitableFor: ['All age groups', 'Healthy snacking'],
    image: img('page-05-img-06.png'),
    isOrganic: true,
    isGlutenFree: true,
  },
  {
    id: 'chakali',
    slug: 'chakali',
    name: 'Chakali',
    category: productCategories.HERITAGE_FOODS,
    shortDescription: 'Traditional festive chakali — pure and handmade.',
    features: ['Heritage recipe', 'No maida', 'Natural ingredients'],
    healthBenefits: ['Wholesome festival treat', 'Ancient grain goodness'],
    suitableFor: ['Festivals and family gatherings', 'All age groups'],
    image: img('page-05-img-07.jpeg'),
    isOrganic: true,
  },
  {
    id: 'jowar-laddu',
    slug: 'jowar-laddu',
    name: 'Jowar Laddu',
    category: productCategories.HERITAGE_FOODS,
    shortDescription: 'Soft jowar laddu sweetened with jaggery.',
    features: ['Jaggery sweetened', 'Almonds and ghee', 'Handmade'],
    healthBenefits: ['Iron and calcium', 'Sustained energy'],
    suitableFor: ['Kids, adults, and elders'],
    image: img('page-05-img-08.jpeg'),
    isBestseller: true,
    isOrganic: true,
  },
  {
    id: 'jowar-cookies',
    slug: 'jowar-cookies',
    name: 'Jowar Cookies',
    category: productCategories.HERITAGE_FOODS,
    shortDescription: 'Artisanal jowar cookies with cashew — no maida.',
    features: ['Handcrafted cookies', 'No maida, no preservatives', 'Natural ingredients'],
    healthBenefits: ['Wholesome tea-time snack', 'Ancient grain nutrition'],
    suitableFor: ['Kids and adults', 'School tiffin and tea-time'],
    image: img('page-05-img-09.jpeg'),
    isBestseller: true,
    isFeatured: true,
    isOrganic: true,
  },
  {
    id: 'ragi-cookies',
    slug: 'ragi-cookies',
    name: 'Ragi Cookies',
    category: productCategories.HERITAGE_FOODS,
    shortDescription: 'Calcium-rich ragi cookies — guilt-free snacking.',
    features: ['Ragi-based', 'Handmade', 'No preservatives'],
    healthBenefits: ['Rich in calcium', 'Supports bone health'],
    suitableFor: ['Kids, elderly, and working professionals'],
    image: img('page-05-img-10.jpeg'),
    isOrganic: true,
    isGlutenFree: true,
  },
  {
    id: 'bajra-cookies',
    slug: 'bajra-cookies',
    name: 'Bajra Cookies',
    category: productCategories.HERITAGE_FOODS,
    shortDescription: 'Bajra cookies — iron-rich heritage treat.',
    features: ['Bajra rich in iron and calcium', 'Jaggery sweetened', 'Handmade'],
    healthBenefits: ['Bones and energy', 'Natural sweetness'],
    suitableFor: ['All age groups', 'Healthy snacking'],
    image: img('page-05-img-11.jpeg'),
    isOrganic: true,
  },
  {
    id: 'ragi-laddu',
    slug: 'ragi-laddu',
    name: 'Ragi Laddu',
    category: productCategories.HERITAGE_FOODS,
    shortDescription: 'Nutritious ragi laddu with ghee and jaggery.',
    features: ['Ragi and ghee', 'Jaggery sweetened', 'Pure and handmade'],
    healthBenefits: ['Calcium and iron rich', 'Sustained natural energy'],
    suitableFor: ['Kids, adults, and elders'],
    image: img('page-05-img-12.jpeg'),
    isOrganic: true,
    isGlutenFree: true,
  },

  // Breakfast
  {
    id: 'ragi-dosa',
    slug: 'ragi-dosa',
    name: 'Ragi Dosa',
    category: productCategories.BREAKFAST,
    shortDescription: '100% natural gluten-free ragi dosa mix.',
    features: ['100% natural and gluten-free', 'Rich in calcium, iron and fiber'],
    healthBenefits: [
      'Strengthens bones and teeth',
      'Supports blood sugar control',
      'Keeps you full for longer',
    ],
    suitableFor: ['All age groups', 'Busy lifestyles', 'Weight management'],
    image: img('page-07-img-02.jpeg'),
    isFeatured: true,
    isBestseller: true,
    isOrganic: true,
    isGlutenFree: true,
  },
  {
    id: 'ragi-idli',
    slug: 'ragi-idli',
    name: 'Ragi Idli',
    category: productCategories.BREAKFAST,
    shortDescription: 'Soft, light, high-protein gluten-free ragi idli mix.',
    features: ['Soft, light and easily digestible', 'Gluten-free and high in protein'],
    healthBenefits: [
      'Beneficial for bones and blood',
      'Supports blood sugar balance',
      'Weight management friendly',
    ],
    suitableFor: ['Fitness enthusiasts', 'Kids, elders and working individuals'],
    image: img('page-08-img-02.jpeg'),
    isFeatured: true,
    isOrganic: true,
    isGlutenFree: true,
  },
  {
    id: 'thalipeeth-bhajani',
    slug: 'thalipeeth-bhajani',
    name: 'Thalipeeth Bhajani',
    category: productCategories.BREAKFAST,
    shortDescription: 'Authentic Maharashtrian multigrain thalipeeth bhajani.',
    features: ['Wholesome multigrain blend', 'Traditional and flavorful', 'Packed with protein and fiber'],
    healthBenefits: ['Essential fasting energy', 'Easy to digest'],
    suitableFor: ['Those observing fasts', 'Light nutritious meals'],
    image: img('page-07-img-01.jpeg'),
    isOrganic: true,
  },
  {
    id: 'farhali-dosa',
    slug: 'farhali-dosa',
    name: 'Farhali Dosa',
    category: productCategories.BREAKFAST,
    shortDescription: 'Specially made for fasting days — light and wholesome.',
    features: ['Made for fasting days', 'Light, wholesome, and energizing'],
    healthBenefits: ['Essential energy during fasting', 'Easy to digest'],
    suitableFor: ['Those observing fasts', 'Light yet nutritious meals'],
    image: img('page-08-img-03.jpeg'),
    isOrganic: true,
  },
  {
    id: 'ghavane-flour',
    slug: 'ghavane-flour',
    name: 'Ghavane Flour',
    category: productCategories.BREAKFAST,
    shortDescription: 'Authentic Konkani ghavane flour — quick and easy.',
    features: ['Traditional Konkani breakfast', 'Quick and easy to prepare', 'Soft and flavorful'],
    healthBenefits: ['Easy to digest', 'Provides instant energy'],
    suitableFor: ['Breakfast or light dinner', 'All age groups'],
    image: img('page-08-img-01.jpeg'),
    isOrganic: true,
  },
  {
    id: 'ragi-rava-sooji',
    slug: 'ragi-rava-sooji',
    name: 'Ragi Rava / Sooji',
    category: productCategories.BREAKFAST,
    shortDescription: 'Quick-cooking gluten-free ragi rava — calcium rich.',
    features: ['Cooks quickly', 'Rich natural source of calcium', '100% gluten-free'],
    healthBenefits: ['Strengthens bones', 'Supports weight and blood sugar management'],
    suitableFor: ['Kids, elderly, and working professionals'],
    image: img('page-08-img-03.jpeg'),
    isOrganic: true,
    isGlutenFree: true,
  },

  // Grains & Meals
  {
    id: 'ragi-rice',
    slug: 'ragi-rice',
    name: 'Ragi Rice',
    category: productCategories.GRAINS_MEALS,
    shortDescription: 'Natural gluten-free ragi rice — wholesome daily meals.',
    features: ['Natural gluten-free grain', 'Rich in calcium, fiber, and iron'],
    healthBenefits: [
      'Strengthens bones and teeth',
      'Easy to digest, suitable for diabetics',
      'Aids in weight management',
    ],
    suitableFor: ['Health-conscious individuals', 'All age groups'],
    image: img('page-09-img-01.jpeg'),
    isFeatured: true,
    isOrganic: true,
    isGlutenFree: true,
  },
  {
    id: 'multimillet-khichdi',
    slug: 'multimillet-khichdi',
    name: 'Multimillet Khichdi',
    category: productCategories.GRAINS_MEALS,
    shortDescription: 'Balanced blend of wholesome grains — light yet filling.',
    features: ['Balanced wholesome grains', 'Rich in protein, fiber, and minerals'],
    healthBenefits: ['Improves digestion', 'Beneficial for heart and bone health'],
    suitableFor: ['Quick dinner or breakfast', 'Fitness and diet-conscious individuals'],
    image: img('page-09-img-02.jpeg'),
    isBestseller: true,
    isOrganic: true,
  },

  // Festival Special
  {
    id: 'aromatic-modak-flour',
    slug: 'aromatic-modak-flour',
    name: 'Aromatic Modak Flour',
    category: productCategories.FESTIVAL_SPECIAL,
    shortDescription: 'Ambemohar rice flour — delightful aroma for modaks.',
    features: [
      'Delightful aroma of Ambemohar rice',
      '100% pure and natural',
      'Smooth and soft modaks every time',
    ],
    healthBenefits: ['Light and easy to digest', 'Traditional festive purity'],
    suitableFor: ['Modaks, ukdiche poli, and festive delicacies', 'Kids to elders'],
    image: img('page-10-img-01.jpeg'),
    isFeatured: true,
    isOrganic: true,
  },

  // Ghee
  {
    id: 'bilona-desi-cow-ghee',
    slug: 'bilona-desi-cow-ghee',
    name: 'Bilona Style Desi Cow Ghee',
    category: productCategories.GHEE,
    shortDescription: 'Traditional bilona method — aromatic golden purity.',
    features: [
      '100% pure and natural',
      'Free from chemicals and artificial additives',
      'Aromatic, golden-colored ghee',
    ],
    healthBenefits: [
      'Improves digestion and enhances appetite',
      'Beneficial for bones, joints, and brain',
      'Nourishes skin and hair, boosts immunity',
    ],
    suitableFor: [
      'Daily use in meals',
      'Children, pregnant women, and the elderly',
      'Festivals, offerings (Naivedya), and rituals',
    ],
    image: img('page-12-img-01.png'),
    isHero: true,
    isFeatured: true,
    isBestseller: true,
    isOrganic: true,
  },
];

export const heroProduct = catalogueProducts.find((p) => p.id === 'sprouted-ragi-cereal')!;
export const heroSecondaryProduct = catalogueProducts.find((p) => p.id === 'bilona-desi-cow-ghee')!;

export const featuredProducts = catalogueProducts.filter((p) => p.isFeatured);
export const bestsellerProducts = catalogueProducts.filter((p) => p.isBestseller);

export function getProductsByCategory(category: ProductCategorySlug) {
  return catalogueProducts.filter((p) => p.category === category);
}

export function getProductBySlug(slug: string) {
  return catalogueProducts.find((p) => p.slug === slug);
}

export function getRelatedProductsBySlug(slug: string, limit = 4) {
  const product = getProductBySlug(slug);
  if (!product) return [];
  return catalogueProducts
    .filter((p) => p.slug !== slug && p.category === product.category)
    .sort((a, b) => {
      const score = (p: CatalogueProduct) =>
        (p.isBestseller ? 2 : 0) + (p.isFeatured ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, limit);
}
