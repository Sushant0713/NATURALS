import { Suspense } from 'react';

import { AdminLoginForm } from '@/components/admin/admin-login-form';
import { Card, Container, Typography } from '@/components/ui';

export const metadata = {
  title: 'Admin Login',
  description: 'Sign in to the RAANJAAI NATURALS admin panel.',
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Container size="sm" className="flex min-h-screen flex-col justify-center py-12">
        <div className="mb-8 text-center">
          <Typography variant="overline">Administration</Typography>
          <Typography variant="h1" className="mt-2 text-3xl">
            Admin Panel
          </Typography>
          <Typography variant="lead" className="mt-3">
            Manage your store, orders, and content.
          </Typography>
        </div>

        <Card padding="lg" className="mx-auto w-full max-w-md">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted" />}>
            <AdminLoginForm />
          </Suspense>
        </Card>
      </Container>
    </div>
  );
}
