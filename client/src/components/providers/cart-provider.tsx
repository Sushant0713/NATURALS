'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { storeCoupons } from '@/constants/cart';
import type { ShippingMethodId } from '@/constants/cart';
import { calculateCartTotals, validateCoupon } from '@/lib/cart/calculate-cart';
import type { AppliedCoupon, CartItem } from '@/lib/cart/types';

const CART_KEY = 'raanjaai-cart';

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

interface CartContextValue {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  couponError: string | null;
  shippingMethod: ShippingMethodId;
  isHydrated: boolean;
  isMiniCartOpen: boolean;
  totals: ReturnType<typeof calculateCartTotals>;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  setShippingMethod: (method: ShippingMethodId) => void;
  openMiniCart: () => void;
  closeMiniCart: () => void;
  toggleMiniCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>('standard');
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setIsHydrated(true);
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  }, []);

  const totals = useMemo(
    () => calculateCartTotals(items, coupon, shippingMethod),
    [items, coupon, shippingMethod]
  );

  const addItem = useCallback(
    (productId: string, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === productId);
        const next = existing
          ? prev.map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.min(99, i.quantity + quantity) }
                : i
            )
          : [...prev, { productId, quantity }];
        localStorage.setItem(CART_KEY, JSON.stringify(next));
        return next;
      });
      setIsMiniCartOpen(true);
    },
    []
  );

  const removeItem = useCallback(
    (productId: string) => {
      persist(items.filter((i) => i.productId !== productId));
    },
    [items, persist]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(productId);
        return;
      }
      persist(
        items.map((i) =>
          i.productId === productId ? { ...i, quantity: Math.min(99, quantity) } : i
        )
      );
    },
    [items, persist, removeItem]
  );

  const clearCart = useCallback(() => {
    persist([]);
    setCoupon(null);
    setCouponError(null);
  }, [persist]);

  const applyCoupon = useCallback(
    (code: string) => {
      const result = validateCoupon(code, totals.subtotal, storeCoupons);
      if (!result.valid || !result.coupon) {
        setCouponError(result.error ?? 'Invalid coupon');
        setCoupon(null);
        return false;
      }
      setCoupon(result.coupon);
      setCouponError(null);
      return true;
    },
    [totals.subtotal]
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setCouponError(null);
  }, []);

  const value = useMemo(
    () => ({
      items,
      coupon,
      couponError,
      shippingMethod,
      isHydrated,
      isMiniCartOpen,
      totals,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      setShippingMethod,
      openMiniCart: () => setIsMiniCartOpen(true),
      closeMiniCart: () => setIsMiniCartOpen(false),
      toggleMiniCart: () => setIsMiniCartOpen((v) => !v),
    }),
    [
      items,
      coupon,
      couponError,
      shippingMethod,
      isHydrated,
      isMiniCartOpen,
      totals,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
