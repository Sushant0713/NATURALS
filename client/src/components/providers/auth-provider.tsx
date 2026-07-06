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
import { useQueryClient } from '@tanstack/react-query';

import {
  hydrateAuthSession,
  useAdminLoginMutation,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from '@/hooks/queries/use-auth-queries';
import { queryKeys } from '@/lib/query/query-keys';
import type { LoginCredentials, RegisterCredentials, SafeUser } from '@/types/auth';

interface AuthContextValue {
  user: SafeUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  adminLogin: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginMutation = useLoginMutation();
  const adminLoginMutation = useAdminLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    let cancelled = false;

    hydrateAuthSession(queryClient).then((me) => {
      if (!cancelled) {
        setUser(me);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [queryClient]);

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey[0] === queryKeys.auth.all[0] && event.query.queryKey[1] === 'me') {
        setUser((event.query.state.data as SafeUser | null) ?? null);
      }
    });
    return unsubscribe;
  }, [queryClient]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await loginMutation.mutateAsync(credentials);
      setUser(result.user);
    },
    [loginMutation]
  );

  const adminLogin = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await adminLoginMutation.mutateAsync(credentials);
      setUser(result.user);
    },
    [adminLoginMutation]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      const result = await registerMutation.mutateAsync(credentials);
      setUser(result.user);
    },
    [registerMutation]
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
  }, [logoutMutation]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      adminLogin,
      register,
      logout,
    }),
    [user, isLoading, login, adminLogin, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
