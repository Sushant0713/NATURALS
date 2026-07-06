'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { useAuth } from '@/components/providers/auth-provider';
import { Typography } from '@/components/ui';
import { ADMIN_ROLES, adminRoutes } from '@/constants/admin-routes';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAdmin = user && ADMIN_ROLES.includes(user.role as (typeof ADMIN_ROLES)[number]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const qs = searchParams.toString();
      const returnUrl = qs ? `${pathname}?${qs}` : pathname;
      router.replace(`${adminRoutes.login}?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (!isAdmin) {
      router.replace('/');
    }
  }, [isAuthenticated, isAdmin, isLoading, pathname, router, searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Typography variant="body" className="animate-pulse text-muted-foreground">
          Loading admin...
        </Typography>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Typography variant="body" className="text-muted-foreground">
          Redirecting...
        </Typography>
      </div>
    );
  }

  return <>{children}</>;
}
