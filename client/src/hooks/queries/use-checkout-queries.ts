'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createCheckoutOrder,
  createAddress,
  getOrder,
  getPaymentConfig,
  listAddresses,
  verifyOrder,
} from '@/lib/api/checkout';
import { queryKeys } from '@/lib/query/query-keys';
import type { CreateCheckoutPayload } from '@/types/checkout';

export function usePaymentConfigQuery() {
  return useQuery({
    queryKey: queryKeys.checkout.paymentConfig(),
    queryFn: getPaymentConfig,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCheckoutAddressesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.checkout.addresses(),
    queryFn: listAddresses,
    enabled,
  });
}

export function useCreateCheckoutAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.checkout.addresses() });
      queryClient.invalidateQueries({ queryKey: queryKeys.account.addresses() });
    },
  });
}

export function useOrderQuery(orderNumber: string | null) {
  return useQuery({
    queryKey: queryKeys.checkout.order(orderNumber ?? ''),
    queryFn: () => getOrder(orderNumber!),
    enabled: !!orderNumber,
  });
}

export function useVerifyOrderQuery(orderNumber: string | null) {
  return useQuery({
    queryKey: queryKeys.checkout.verify(orderNumber ?? ''),
    queryFn: () => verifyOrder(orderNumber!),
    enabled: !!orderNumber,
    retry: 2,
  });
}

export function useCreateCheckoutMutation() {
  return useMutation({
    mutationFn: (payload: CreateCheckoutPayload) => createCheckoutOrder(payload),
  });
}
