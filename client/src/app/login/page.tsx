import { Suspense } from 'react';

import { LoginForm } from '@/components/auth/login-form';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Card, Container, Typography } from '@/components/ui';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'Sign In',
  description: 'Sign in to your RAANJAAI NATURALS account.',
  path: '/login',
  noIndex: true,
});

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-18">
        <Container size="sm" className="py-12 md:py-16">
          <div className="mb-8 text-center">
            <Typography variant="overline">Account</Typography>
            <Typography variant="h1" className="mt-2 text-3xl">
              Welcome Back
            </Typography>
            <Typography variant="lead" className="mt-3">
              Sign in to access your cart and orders.
            </Typography>
          </div>

          <Card padding="lg" className="mx-auto max-w-md">
            <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted" />}>
              <LoginForm />
            </Suspense>
          </Card>
        </Container>
      </main>
      <Footer />
    </>
  );
}
