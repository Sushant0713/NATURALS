'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  adminLogin,
  fetchCurrentUser,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from '@/lib/api/auth';
import { setStoredAccessToken, getStoredAccessToken } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/query-keys';
import type { SafeUser } from '@/types/auth';

export function useCurrentUserQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: fetchCurrentUser,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.account.all });
    },
  });
}

export function useAdminLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      queryClient.setQueryData(queryKeys.auth.me(), null);
      queryClient.clear();
    },
  });
}

export async function hydrateAuthSession(
  queryClient: ReturnType<typeof useQueryClient>
): Promise<SafeUser | null> {
  try {
    const refreshed = await refreshSession();
    if (refreshed?.user) {
      queryClient.setQueryData(queryKeys.auth.me(), refreshed.user);
      return refreshed.user;
    }

    if (!getStoredAccessToken()) {
      queryClient.setQueryData(queryKeys.auth.me(), null);
      return null;
    }

    const me = await fetchCurrentUser();
    queryClient.setQueryData(queryKeys.auth.me(), me);
    return me;
  } catch {
    setStoredAccessToken(null);
    queryClient.setQueryData(queryKeys.auth.me(), null);
    return null;
  }
}
