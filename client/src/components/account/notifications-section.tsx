'use client';

import Link from 'next/link';

import { Badge, Button, Card, Typography } from '@/components/ui';
import { QueryError } from '@/components/query/query-error';
import { QueryLoading } from '@/components/query/query-loading';
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from '@/hooks/queries';

export function NotificationsSection() {
  const { data, isLoading, isError, error, refetch } = useNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();

  const notifications = data?.items ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  if (isLoading) return <QueryLoading variant="list" rows={3} />;

  if (isError) {
    return (
      <QueryError error={error} onRetry={() => refetch()} title="Failed to load notifications" />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Typography variant="h1" className="text-2xl sm:text-3xl">
            Notifications
          </Typography>
          <Typography variant="body-sm" className="mt-2 text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </Typography>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            {markAllRead.isPending ? 'Updating...' : 'Mark all read'}
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Typography variant="body-sm" className="text-muted-foreground">
            No notifications yet.
          </Typography>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              padding="md"
              className={n.isRead ? 'opacity-75' : 'border-primary/30 bg-primary/5'}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Typography variant="label">{n.title}</Typography>
                    {!n.isRead && (
                      <Badge variant="secondary" size="sm">
                        New
                      </Badge>
                    )}
                  </div>
                  <Typography variant="body-sm" className="mt-1 text-muted-foreground">
                    {n.message}
                  </Typography>
                  <Typography variant="caption" className="mt-2 block">
                    {new Date(n.createdAt).toLocaleString('en-IN')}
                  </Typography>
                  {n.link && (
                    <Link
                      href={n.link}
                      className="mt-2 inline-block text-sm text-secondary hover:underline"
                    >
                      View details →
                    </Link>
                  )}
                </div>
                {!n.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markRead.mutate(n.id)}
                    disabled={markRead.isPending}
                  >
                    Mark read
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
