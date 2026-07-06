'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Heart,
  MapPin,
  Package,
  Settings,
  Star,
  Tag,
  User,
} from 'lucide-react';

import { useAuth } from '@/components/providers/auth-provider';
import { Icon, Typography } from '@/components/ui';
import { routes } from '@/constants/routes';
import { cn } from '@/lib/utils';

const navItems = [
  { href: routes.account.profile, label: 'Profile', icon: User },
  { href: routes.account.orders, label: 'Orders', icon: Package },
  { href: routes.account.wishlist, label: 'Wishlist', icon: Heart },
  { href: routes.account.addresses, label: 'Addresses', icon: MapPin },
  { href: routes.account.reviews, label: 'Reviews', icon: Star },
  { href: routes.account.coupons, label: 'Coupons', icon: Tag },
  { href: routes.account.notifications, label: 'Notifications', icon: Bell },
  { href: routes.account.settings, label: 'Settings', icon: Settings },
];

interface AccountNavProps {
  onNavigate?: () => void;
  className?: string;
}

export function AccountNav({ onNavigate, className }: AccountNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className={cn('space-y-1', className)}>
      <div className="mb-4 px-3">
        <Typography variant="label">{user?.name}</Typography>
        <Typography variant="caption" className="mt-0.5 block truncate">
          {user?.email}
        </Typography>
      </div>

      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 font-accent text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon icon={item.icon} size="sm" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
