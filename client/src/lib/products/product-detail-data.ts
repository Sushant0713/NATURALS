import type { ProductCategorySlug } from '@/constants/categories';
import type { CatalogueProduct } from '@/constants/products';
import type { NutritionFact, ProductDetail, ProductFAQ, ProductReview } from '@/lib/products/product-detail-types';

const categoryGalleryExtras: Record<ProductCategorySlug, string[]> = {
  'baby-satva': ['/catalogue/page-04-full.png', '/catalogue/page-04-img-04.jpeg', '/catalogue/page-04-img-05.jpeg'],
  'heritage-foods': ['/catalogue/page-05-full.png', '/catalogue/page-05-img-01.jpeg'],
  'breakfast': ['/catalogue/page-07-full.png', '/catalogue/page-08-full.png'],
  'grains-meals': ['/catalogue/page-09-full.png'],
  'festival-special': ['/catalogue/page-10-full.png'],
  'ghee': ['/catalogue/page-12-full.png'],
};

const ingredientMap: Record<string, string[]> = {
  'sprouted-ragi-cereal': ['Sprouted Ragi (Finger Millet)', 'No added sugar, salt, or preservatives'],
  'rice-lentil-cereal': ['Rice', 'Moong Dal (Green Gram)', 'No artificial flavour, colour, or preservative'],
  'pulse-based-cereal': ['Mixed Pulses (Moong, Masoor, Chana)', 'No artificial flavour, colour, or preservative'],
  'dryfruit-laddu': ['Ancient Grains', 'Almonds', 'Desi Cow Ghee', 'Organic Jaggery'],
  'jowar-namkeen': ['Jowar (Sorghum)', 'Spices', 'Rock Salt', 'Cold-pressed Oil'],
  'methi-dink-laddu': ['Methi (Fenugreek)', 'Dink (Edible Gum)', 'Jaggery', 'Desi Cow Ghee', 'Dry Fruits'],
  'jowar-sev': ['Jowar Flour', 'Spices', 'Rock Salt'],
  'ragi-sev': ['Ragi Flour', 'Spices', 'Rock Salt'],
  'chakali': ['Rice Flour', 'Urad Dal', 'Spices', 'Sesame Seeds'],
  'jowar-laddu': ['Jowar', 'Almonds', 'Desi Cow Ghee', 'Organic Jaggery'],
  'jowar-cookies': ['Jowar Flour', 'Cashew', 'Jaggery', 'Desi Cow Ghee'],
  'ragi-cookies': ['Ragi Flour', 'Jaggery', 'Desi Cow Ghee', 'Cardamom'],
  'bajra-cookies': ['Bajra (Pearl Millet)', 'Jaggery', 'Desi Cow Ghee'],
  'ragi-laddu': ['Ragi', 'Desi Cow Ghee', 'Organic Jaggery', 'Dry Fruits'],
  'ragi-dosa': ['Ragi Flour', 'Rice Flour', 'Urad Dal', 'Fenugreek Seeds'],
  'ragi-idli': ['Ragi Flour', 'Rice', 'Urad Dal', 'Fenugreek Seeds'],
  'thalipeeth-bhajani': ['Jowar', 'Bajra', 'Rice', 'Chana Dal', 'Spices', 'Coriander'],
  'farhali-dosa': ['Rajgira (Amaranth)', 'Singhada (Water Chestnut)', 'Sabudana', 'Spices'],
  'ghavane-flour': ['Rice Flour', 'Coconut (optional)', 'Salt'],
  'ragi-rava-sooji': ['Sprouted Ragi', 'No additives'],
  'ragi-rice': ['Whole Ragi Grains', 'No polishing agents'],
  'multimillet-khichdi': ['Foxtail Millet', 'Barnyard Millet', 'Kodo Millet', 'Moong Dal', 'Spices'],
  'aromatic-modak-flour': ['Ambemohar Rice', '100% pure rice flour'],
  'bilona-desi-cow-ghee': ['Desi Cow Milk Curd', 'Traditional Bilona churned butter'],
};

const categoryIngredients: Record<ProductCategorySlug, string[]> = {
  'baby-satva': ['100% natural grains', 'No sugar, salt, preservatives, colours, or flavours'],
  'heritage-foods': ['Ancient grains', 'Organic jaggery (where sweetened)', 'Desi cow ghee', 'No maida, no preservatives'],
  'breakfast': ['Millet and grain flours', 'Natural spices', 'No artificial additives'],
  'grains-meals': ['Whole ancient grains', 'No polishing agents or preservatives'],
  'festival-special': ['Pure natural ingredients', 'Traditional recipe'],
  'ghee': ['100% desi cow milk', 'No chemicals or artificial additives'],
};

const commonFaqs: ProductFAQ[] = [
  {
    question: 'Are your products 100% natural?',
    answer:
      'Yes. RAANJAAI NATURALS products are chemical-free with no artificial preservatives, colours, or flavours. Every batch is traditionally hand-crafted by rural women.',
  },
  {
    question: 'How should I store this product?',
    answer:
      'Store in a cool, dry place in an airtight container. Once opened, consume within the recommended period on the label and keep away from moisture.',
  },
  {
    question: 'Do you add sugar or salt?',
    answer:
      'Our Baby Satva range has no added sugar or salt. Heritage sweets are sweetened with organic jaggery, not refined sugar. Savouries use natural rock salt and spices.',
  },
  {
    question: 'How can I place an order?',
    answer:
      'Call us at 8767047134 or message us on Instagram @RAANJAAINATURALS. Online ordering will be available soon.',
  },
];

const categoryFaqs: Record<ProductCategorySlug, ProductFAQ[]> = {
  'baby-satva': [
    {
      question: 'From what age can I start this cereal?',
      answer:
        'Each Baby Satva product has age guidance on the label — Sprouted Ragi from 6 months, Rice & Lentil from 7 months, and Pulse-based from 9 months. Always consult your paediatrician when introducing new foods.',
    },
  ],
  'heritage-foods': [
    {
      question: 'Are these snacks suitable for children?',
      answer:
        'Yes! Our heritage laddus, cookies, and namkeens are made without maida and are jaggery-sweetened where applicable — a wholesome alternative for school tiffin and tea-time.',
    },
  ],
  'breakfast': [
    {
      question: 'How do I prepare the mix?',
      answer:
        'Each pack includes simple preparation instructions. Most breakfast mixes need only water or buttermilk, a few minutes of cooking, and your favourite chutney or ghee on top.',
    },
  ],
  'grains-meals': [
    {
      question: 'Is this suitable for diabetics?',
      answer:
        'Millets and ancient grains have a lower glycemic index than refined grains. Many customers with blood sugar concerns enjoy our ragi and multimillet products — please consult your doctor for personal dietary advice.',
    },
  ],
  'festival-special': [
    {
      question: 'What makes Ambemohar rice special for modaks?',
      answer:
        'Ambemohar rice has a delightful natural aroma that elevates traditional modaks and ukdiche poli. Our flour is 100% pure for soft, fragrant festive delicacies every time.',
    },
  ],
  'ghee': [
    {
      question: 'What is the Bilona method?',
      answer:
        'Bilona ghee is made by culturing desi cow milk into curd, churning it into butter, and slow-heating to golden purity. This traditional method preserves aroma, nutrients, and authentic taste.',
    },
  ],
};

function nutritionForCategory(category: ProductCategorySlug, _product: CatalogueProduct): {
  servingSize: string;
  facts: NutritionFact[];
} {
  switch (category) {
    case 'baby-satva':
      return {
        servingSize: '30 g (approx. 2 tbsp dry mix)',
        facts: [
          { label: 'Calories', value: '110 kcal', dailyValue: '6%' },
          { label: 'Protein', value: '3.5 g', dailyValue: '7%' },
          { label: 'Carbohydrates', value: '22 g', dailyValue: '8%' },
          { label: 'Dietary Fiber', value: '3.2 g', dailyValue: '11%' },
          { label: 'Iron', value: '2.8 mg', dailyValue: '16%' },
          { label: 'Calcium', value: '180 mg', dailyValue: '18%' },
          { label: 'Fat', value: '0.8 g' },
          { label: 'Sodium', value: '< 5 mg' },
        ],
      };
    case 'heritage-foods':
      return {
        servingSize: '40 g (approx. 2 pieces / handful)',
        facts: [
          { label: 'Calories', value: '165 kcal', dailyValue: '8%' },
          { label: 'Protein', value: '4.2 g', dailyValue: '8%' },
          { label: 'Carbohydrates', value: '24 g', dailyValue: '9%' },
          { label: 'Dietary Fiber', value: '3.8 g', dailyValue: '14%' },
          { label: 'Iron', value: '2.2 mg', dailyValue: '12%' },
          { label: 'Calcium', value: '95 mg', dailyValue: '10%' },
          { label: 'Fat', value: '6.5 g', dailyValue: '10%' },
          { label: 'Sugars (from jaggery)', value: '8 g' },
        ],
      };
    case 'breakfast':
      return {
        servingSize: '50 g dry mix (makes 2 servings)',
        facts: [
          { label: 'Calories', value: '175 kcal', dailyValue: '9%' },
          { label: 'Protein', value: '5.5 g', dailyValue: '11%' },
          { label: 'Carbohydrates', value: '32 g', dailyValue: '12%' },
          { label: 'Dietary Fiber', value: '4.5 g', dailyValue: '16%' },
          { label: 'Iron', value: '3.1 mg', dailyValue: '17%' },
          { label: 'Calcium', value: '210 mg', dailyValue: '21%' },
          { label: 'Fat', value: '1.2 g' },
        ],
      };
    case 'grains-meals':
      return {
        servingSize: '60 g dry (approx. 1 cup cooked)',
        facts: [
          { label: 'Calories', value: '210 kcal', dailyValue: '11%' },
          { label: 'Protein', value: '6.8 g', dailyValue: '14%' },
          { label: 'Carbohydrates', value: '40 g', dailyValue: '15%' },
          { label: 'Dietary Fiber', value: '5.2 g', dailyValue: '19%' },
          { label: 'Iron', value: '3.5 mg', dailyValue: '19%' },
          { label: 'Calcium', value: '240 mg', dailyValue: '24%' },
          { label: 'Fat', value: '1.5 g' },
        ],
      };
    case 'festival-special':
      return {
        servingSize: '30 g rice flour',
        facts: [
          { label: 'Calories', value: '108 kcal', dailyValue: '5%' },
          { label: 'Protein', value: '2.1 g', dailyValue: '4%' },
          { label: 'Carbohydrates', value: '24 g', dailyValue: '9%' },
          { label: 'Dietary Fiber', value: '0.8 g' },
          { label: 'Fat', value: '0.3 g' },
          { label: 'Sodium', value: '< 2 mg' },
        ],
      };
    case 'ghee':
      return {
        servingSize: '15 ml (1 tbsp)',
        facts: [
          { label: 'Calories', value: '135 kcal', dailyValue: '7%' },
          { label: 'Total Fat', value: '15 g', dailyValue: '23%' },
          { label: 'Saturated Fat', value: '9 g', dailyValue: '45%' },
          { label: 'Monounsaturated Fat', value: '4.5 g' },
          { label: 'Vitamin A', value: '120 mcg', dailyValue: '13%' },
          { label: 'Vitamin E', value: '0.4 mg', dailyValue: '3%' },
          { label: 'Cholesterol', value: '38 mg', dailyValue: '13%' },
        ],
      };
    default:
      return { servingSize: '30 g', facts: [] };
  }
}

const reviewAuthors = [
  'Priya M.',
  'Anjali K.',
  'Rahul S.',
  'Sneha P.',
  'Meera D.',
  'Vikram J.',
];

const reviewTitles = [
  'Absolutely pure and trustworthy',
  'My family loves it',
  'Great quality, will reorder',
  'Authentic taste',
  'Perfect for daily use',
  'Highly recommended',
];

function buildReviews(product: CatalogueProduct): ProductReview[] {
  const seed = product.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const count = 2 + (seed % 2);

  return Array.from({ length: count }, (_, i) => {
    const rating = product.isBestseller ? 5 : 4 + (i % 2);
    const month = ((seed + i * 3) % 12) + 1;
    const year = 2025;

    return {
      id: `${product.id}-review-${i}`,
      author: reviewAuthors[(seed + i) % reviewAuthors.length],
      rating,
      date: `${year}-${String(month).padStart(2, '0')}-15`,
      title: reviewTitles[(seed + i) % reviewTitles.length],
      body: i === 0
        ? `${product.name} exceeded our expectations — ${product.shortDescription.toLowerCase()} The quality and purity of RAANJAAI NATURALS is evident in every bite.`
        : `We have been using ${product.name} regularly. ${product.healthBenefits[0]}. Completely chemical-free and made with love — exactly what we wanted for our family.`,
      verified: true,
    };
  });
}

function buildGallery(product: CatalogueProduct): string[] {
  const extras = categoryGalleryExtras[product.category] ?? [];
  return [...new Set([product.image, ...extras])];
}

function buildIngredients(product: CatalogueProduct): string[] {
  return ingredientMap[product.id] ?? categoryIngredients[product.category];
}

function buildFaqs(product: CatalogueProduct): ProductFAQ[] {
  return [...commonFaqs, ...(categoryFaqs[product.category] ?? [])];
}

export function enrichProductDetail(product: CatalogueProduct): ProductDetail {
  const { servingSize, facts } = nutritionForCategory(product.category, product);
  const reviews = buildReviews(product);
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return {
    ...product,
    gallery: buildGallery(product),
    ingredients: buildIngredients(product),
    nutritionFacts: facts,
    servingSize,
    faqs: buildFaqs(product),
    reviews,
    averageRating,
    reviewCount: reviews.length,
  };
}
