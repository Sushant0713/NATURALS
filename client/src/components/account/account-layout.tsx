'use client';

import { Suspense, useState } from 'react';
import { Menu, X } from 'lucide-react';

import { AccountNav } from '@/components/account/account-nav';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Button, Container, Icon } from '@/components/ui';
import { routes } from '@/constants/routes';

function AccountLayoutContent({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <ProtectedRoute redirectTo={routes.login}>
      <Container className="py-8 md:py-12">
        <Button
          variant="outline"
          size="sm"
          className="mb-6 lg:hidden"
          onClick={() => setMobileNavOpen(true)}
        >
          <Icon icon={Menu} size="sm" />
          Account Menu
        </Button>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-surface p-4">
              <AccountNav />
            </div>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </Container>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-heritage/50 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(100%,280px)] overflow-y-auto bg-surface p-5 shadow-elevated">
            <div className="mb-4 flex justify-end">
              <Button variant="ghost" size="icon-sm" onClick={() => setMobileNavOpen(false)}>
                <Icon icon={X} size="md" />
              </Button>
            </div>
            <AccountNav onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

export function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-18">
        <Suspense fallback={<div className="container mx-auto animate-pulse px-4 py-12"><div className="h-10 w-48 rounded-lg bg-muted" /></div>}>
          <AccountLayoutContent>{children}</AccountLayoutContent>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
