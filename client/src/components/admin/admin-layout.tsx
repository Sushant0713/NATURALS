'use client';

import { Suspense, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { AdminNav } from '@/components/admin/admin-nav';
import { AdminProtectedRoute } from '@/components/admin/admin-protected-route';
import { Button, Icon } from '@/components/ui';
import { adminRoutes } from '@/constants/admin-routes';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === adminRoutes.login;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen bg-muted/20">
        <aside className="hidden w-64 shrink-0 bg-heritage lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto p-4">
            <AdminNav />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-surface px-4 py-3 lg:hidden">
            <Button variant="outline" size="icon-sm" onClick={() => setMobileNavOpen(true)}>
              <Icon icon={Menu} size="sm" />
            </Button>
            <span className="font-display text-lg font-semibold text-heritage">Admin Panel</span>
          </header>

          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-heritage/50 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(100%,280px)] overflow-y-auto bg-heritage p-5 shadow-elevated">
            <div className="mb-4 flex justify-end">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-primary-foreground hover:bg-white/10"
                onClick={() => setMobileNavOpen(false)}
              >
                <Icon icon={X} size="md" />
              </Button>
            </div>
            <AdminNav onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}
    </AdminProtectedRoute>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
        </div>
      }
    >
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}
