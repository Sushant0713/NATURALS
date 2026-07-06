export const catalogueProductPrices: Record<string, number> = {
  'sprouted-ragi-cereal': 299,
  'rice-lentil-cereal': 279,
  'pulse-based-cereal': 289,
  'dryfruit-laddu': 349,
  'jowar-namkeen': 199,
  'methi-dink-laddu': 329,
  'jowar-sev': 179,
  'ragi-sev': 189,
  'chakali': 249,
  'jowar-laddu': 299,
  'jowar-cookies': 249,
  'ragi-cookies': 259,
  'bajra-cookies': 249,
  'ragi-laddu': 309,
  'ragi-dosa': 199,
  'ragi-idli': 199,
  'thalipeeth-bhajani': 189,
  'farhali-dosa': 219,
  'ghavane-flour': 169,
  'ragi-rava-sooji': 179,
  'ragi-rice': 159,
  'multimillet-khichdi': 229,
  'aromatic-modak-flour': 199,
  'bilona-desi-cow-ghee': 899,
};

export const catalogueProductNames: Record<string, string> = {
  'sprouted-ragi-cereal': 'Sprouted Ragi Cereal (Ragi Satva)',
  'rice-lentil-cereal': 'Rice & Lentil Cereal (Khichdi Satva)',
  'pulse-based-cereal': 'Pulse-based Cereal (Pulses Satva)',
  'dryfruit-laddu': 'Dryfruit Laddu',
  'jowar-namkeen': 'Jowar Namkeen',
  'methi-dink-laddu': 'Methi Dink Laddu',
  'jowar-sev': 'Jowar Sev',
  'ragi-sev': 'Ragi Sev',
  'chakali': 'Chakali',
  'jowar-laddu': 'Jowar Laddu',
  'jowar-cookies': 'Jowar Cookies',
  'ragi-cookies': 'Ragi Cookies',
  'bajra-cookies': 'Bajra Cookies',
  'ragi-laddu': 'Ragi Laddu',
  'ragi-dosa': 'Ragi Dosa',
  'ragi-idli': 'Ragi Idli',
  'thalipeeth-bhajani': 'Thalipeeth Bhajani',
  'farhali-dosa': 'Farhali Dosa',
  'ghavane-flour': 'Ghavane Flour',
  'ragi-rava-sooji': 'Ragi Rava / Sooji',
  'ragi-rice': 'Ragi Rice',
  'multimillet-khichdi': 'Multimillet Khichdi',
  'aromatic-modak-flour': 'Aromatic Modak Flour',
  'bilona-desi-cow-ghee': 'Bilona Style Desi Cow Ghee',
};

export function getCataloguePrice(productId: string): number | null {
  return catalogueProductPrices[productId] ?? null;
}

export function getCatalogueName(productId: string): string | null {
  return catalogueProductNames[productId] ?? null;
}
