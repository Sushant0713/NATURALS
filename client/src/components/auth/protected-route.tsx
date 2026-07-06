'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { useAuth } from '@/components/providers/auth-provider';
import { Container, Typography } from '@/components/ui';
import { routes } from '@/constants/routes';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = routes.login }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const qs = searchParams.toString();
      const returnUrl = qs ? `${pathname}?${qs}` : pathname;
      router.replace(`${redirectTo}?redirect=${encodeURIComponent(returnUrl)}`);
    }
  }, [isAuthenticated, isLoading, pathname, redirectTo, router, searchParams]);

  if (isLoading) {
    return (
      <Container className="flex min-h-[50vh] items-center justify-center py-16">
        <Typography variant="body" className="animate-pulse text-muted-foreground">
          Loading...
        </Typography>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container className="flex min-h-[50vh] items-center justify-center py-16">
        <Typography variant="body" className="text-muted-foreground">
          Redirecting to login...
        </Typography>
      </Container>
    );
  }

  return <>{children}</>;
}
