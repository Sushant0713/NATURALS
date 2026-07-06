/** MRP in INR for catalogue products */
export const productPrices: Record<string, number> = {
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

export function getProductPrice(productId: string): number {
  return productPrices[productId] ?? 0;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
