import { Suspense } from 'react';

import { RegisterForm } from '@/components/auth/register-form';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Card, Container, Typography } from '@/components/ui';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'Create Account',
  description: 'Create your RAANJAAI NATURALS account.',
  path: '/register',
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-18">
        <Container size="sm" className="py-12 md:py-16">
          <div className="mb-8 text-center">
            <Typography variant="overline">Account</Typography>
            <Typography variant="h1" className="mt-2 text-3xl">
              Join RAANJAAI NATURALS
            </Typography>
            <Typography variant="lead" className="mt-3">
              Create an account to save your cart and track orders.
            </Typography>
          </div>

          <Card padding="lg" className="mx-auto max-w-md">
            <Suspense fallback={<div className="h-80 animate-pulse rounded-lg bg-muted" />}>
              <RegisterForm />
            </Suspense>
          </Card>
        </Container>
      </main>
      <Footer />
    </>
  );
}
