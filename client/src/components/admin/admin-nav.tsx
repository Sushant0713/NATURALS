'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  FileText,
  Image,
  LayoutDashboard,
  LineChart,
  LogOut,
  Package,
  Percent,
  ShoppingBag,
  Star,
  Store,
  Tags,
  Users,
  Warehouse,
} from 'lucide-react';

import { useAuth } from '@/components/providers/auth-provider';
import { Icon, Typography } from '@/components/ui';
import { adminRoutes } from '@/constants/admin-routes';
import { routes } from '@/constants/routes';
import { cn } from '@/lib/utils';

const navItems = [
  { href: adminRoutes.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { href: adminRoutes.analytics, label: 'Analytics', icon: LineChart },
  { href: adminRoutes.orders, label: 'Orders', icon: ShoppingBag },
  { href: adminRoutes.products, label: 'Products', icon: Package },
  { href: adminRoutes.categories, label: 'Categories', icon: Tags },
  { href: adminRoutes.users, label: 'Users', icon: Users },
  { href: adminRoutes.inventory, label: 'Inventory', icon: Warehouse },
  { href: adminRoutes.coupons, label: 'Coupons', icon: Percent },
  { href: adminRoutes.reviews, label: 'Reviews', icon: Star },
  { href: adminRoutes.blogs, label: 'Blogs', icon: FileText },
  { href: adminRoutes.reports, label: 'Reports', icon: BarChart3 },
  { href: adminRoutes.banners, label: 'Banners', icon: Image },
];

interface AdminNavProps {
  onNavigate?: () => void;
  className?: string;
}

export function AdminNav({ onNavigate, className }: AdminNavProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onNavigate?.();
  };

  return (
    <nav className={cn('flex h-full flex-col', className)}>
      <div className="mb-6 px-3">
        <Link href={adminRoutes.dashboard} onClick={onNavigate} className="block">
          <Typography variant="label" className="text-primary-foreground">
            RAANJAAI Admin
          </Typography>
          <Typography variant="caption" className="mt-0.5 block truncate text-primary-foreground/70">
            {user?.name}
          </Typography>
        </Link>
      </div>

      <div className="flex-1 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 font-accent text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-primary-foreground/75 hover:bg-white/10 hover:text-primary-foreground'
              )}
            >
              <Icon icon={item.icon} size="sm" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-4 space-y-0.5 border-t border-white/10 pt-4">
        <Link
          href={routes.home}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-accent text-sm font-medium text-primary-foreground/75 transition-colors hover:bg-white/10 hover:text-primary-foreground"
        >
          <Icon icon={Store} size="sm" />
          View Store
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-accent text-sm font-medium text-primary-foreground/75 transition-colors hover:bg-white/10 hover:text-primary-foreground"
        >
          <Icon icon={LogOut} size="sm" />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
