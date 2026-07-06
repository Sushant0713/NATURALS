'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

import { Button, Icon, Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-heritage/60 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-surface shadow-elevated sm:max-w-lg sm:rounded-2xl',
          className
        )}
      >
        {title && (
          <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-5 py-4">
            <Typography variant="h5" as="h2">
              {title}
            </Typography>
            <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
              <Icon icon={X} size="md" />
            </Button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
