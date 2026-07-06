'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '@/components/providers/auth-provider';
import {
  useRemoveWishlistMutation,
  useSyncWishlistMutation,
  useToggleWishlistMutation,
  useWishlistQuery,
} from '@/hooks/queries';

const WISHLIST_KEY = 'raanjaai-wishlist';

function readWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useWishlist() {
  const { isAuthenticated } = useAuth();
  const [localIds, setLocalIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasSynced = useRef(false);

  const { data: serverWishlist } = useWishlistQuery(isAuthenticated && isHydrated);
  const syncMutation = useSyncWishlistMutation();
  const toggleMutation = useToggleWishlistMutation();
  const removeMutation = useRemoveWishlistMutation();

  useEffect(() => {
    setLocalIds(readWishlist());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !isHydrated || hasSynced.current || localIds.length === 0) return;
    hasSynced.current = true;
    syncMutation.mutate(localIds);
  }, [isAuthenticated, isHydrated, localIds, syncMutation]);

  const serverIds = useMemo(
    () => serverWishlist?.map((item) => item.productId) ?? [],
    [serverWishlist]
  );

  const ids = isAuthenticated ? serverIds : localIds;

  const persistLocal = useCallback((next: string[]) => {
    setLocalIds(next);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
  }, []);

  const toggle = useCallback(
    (productId: string) => {
      if (isAuthenticated) {
        toggleMutation.mutate(productId);
        return;
      }
      const next = localIds.includes(productId)
        ? localIds.filter((id) => id !== productId)
        : [...localIds, productId];
      persistLocal(next);
    },
    [isAuthenticated, localIds, persistLocal, toggleMutation]
  );

  const isWishlisted = useCallback((productId: string) => ids.includes(productId), [ids]);

  const remove = useCallback(
    (productId: string) => {
      if (isAuthenticated) {
        removeMutation.mutate(productId);
        return;
      }
      persistLocal(localIds.filter((id) => id !== productId));
    },
    [isAuthenticated, localIds, persistLocal, removeMutation]
  );

  return {
    ids,
    count: ids.length,
    isHydrated,
    toggle,
    isWishlisted,
    remove,
    isSyncing: syncMutation.isPending || toggleMutation.isPending,
  };
}
