'use client';

import { Button, Card, Input, Label, Typography } from '@/components/ui';
import { QueryError } from '@/components/query/query-error';
import { QueryLoading } from '@/components/query/query-loading';
import { getErrorMessage } from '@/lib/api/api-error';
import { useProfileQuery, useUpdateProfileMutation } from '@/hooks/queries';

export function ProfileSection() {
  const { data: profile, isLoading, isError, error, refetch } = useProfileQuery();
  const updateMutation = useUpdateProfileMutation();

  if (isLoading) return <QueryLoading />;

  if (isError || !profile) {
    return <QueryError error={error} onRetry={() => refetch()} title="Failed to load profile" />;
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
  });

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    updateMutation.mutate({
      name: String(form.get('name') ?? ''),
      phone: String(form.get('phone') ?? '') || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h1" className="text-2xl sm:text-3xl">
          My Profile
        </Typography>
        <Typography variant="body-sm" className="mt-2 text-muted-foreground">
          Manage your personal information
        </Typography>
      </div>

      <Card padding="md">
        <form onSubmit={handleSave} className="max-w-lg space-y-4">
          {updateMutation.isSuccess && (
            <div className="rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
              Profile updated successfully.
            </div>
          )}
          {updateMutation.isError && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {getErrorMessage(updateMutation.error)}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" defaultValue={profile.name} required key={profile.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email ?? ''} disabled className="bg-muted" />
            <Typography variant="caption">Email cannot be changed</Typography>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile.phone ?? ''}
              key={profile.phone}
            />
          </div>

          <Typography variant="caption" className="block text-muted-foreground">
            Member since {memberSince}
          </Typography>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
