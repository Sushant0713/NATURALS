'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/components/providers/auth-provider';
import { Button, Card, Input, Label, Typography } from '@/components/ui';
import { QueryLoading } from '@/components/query/query-loading';
import { getErrorMessage } from '@/lib/api/api-error';
import { useProfileQuery, useUpdateSettingsMutation } from '@/hooks/queries';
import type { UserPreferences } from '@/types/account';

const defaultPrefs: UserPreferences = {
  emailNotifications: true,
  orderUpdates: true,
  promotions: true,
  smsNotifications: false,
};

export function SettingsSection() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfileQuery();
  const updateMutation = useUpdateSettingsMutation();
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPrefs);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (profile?.preferences) {
      setPrefs(profile.preferences);
    }
  }, [profile]);

  const togglePref = (key: keyof UserPreferences) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      preferences: prefs,
      ...(newPassword ? { currentPassword, newPassword } : {}),
    }, {
      onSuccess: () => {
        setCurrentPassword('');
        setNewPassword('');
      },
    });
  };

  const isLocalAuth = user?.authProvider === 'LOCAL';

  if (isLoading) return <QueryLoading />;

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h1" className="text-2xl sm:text-3xl">
          Settings
        </Typography>
        <Typography variant="body-sm" className="mt-2 text-muted-foreground">
          Notification preferences and account security
        </Typography>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {updateMutation.isSuccess && (
          <div className="rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
            Settings saved successfully.
          </div>
        )}
        {updateMutation.isError && (
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {getErrorMessage(updateMutation.error)}
          </div>
        )}

        <Card padding="md" className="space-y-4">
          <Typography variant="h5" as="h2">
            Notifications
          </Typography>
          {(
            [
              ['emailNotifications', 'Email notifications'],
              ['orderUpdates', 'Order status updates'],
              ['promotions', 'Promotions and offers'],
              ['smsNotifications', 'SMS notifications'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between gap-4">
              <span className="text-sm">{label}</span>
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={() => togglePref(key)}
                className="size-4 accent-primary"
              />
            </label>
          ))}
        </Card>

        {isLocalAuth && (
          <Card padding="md" className="space-y-4">
            <Typography variant="h5" as="h2">
              Change Password
            </Typography>
            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <Input
                id="current"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <Input
                id="new"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
              />
            </div>
          </Card>
        )}

        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}
