'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '@/components/providers/auth-provider';
import { Button, Input, Label, Typography } from '@/components/ui';
import { adminRoutes } from '@/constants/admin-routes';

export function AdminLoginForm() {
  const { adminLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? adminRoutes.dashboard;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await adminLogin({ email, password });
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="admin-email">Admin Email</Label>
        <Input
          id="admin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="admin@raanjaai.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-password">Password</Label>
        <Input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In to Admin'}
      </Button>

      <Typography variant="caption" className="block text-center text-muted-foreground">
        Authorized administrators only
      </Typography>
    </form>
  );
}
