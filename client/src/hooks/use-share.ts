'use client';

import { useCallback, useState } from 'react';

import { brand } from '@/constants/brand';

interface UseShareOptions {
  title: string;
  text: string;
  url: string;
}

export function useShare() {
  const [copied, setCopied] = useState(false);

  const share = useCallback(async ({ title, text, url }: UseShareOptions) => {
    const shareData = {
      title: `${title} | ${brand.name}`,
      text,
      url,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  }, []);

  return { share, copied };
}
