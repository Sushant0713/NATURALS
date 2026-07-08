'use client';

import { useEffect, useRef, useState } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        // Only trigger once
        observer.unobserve(el);
      }
    }, options);

    observer.observe(el);

    return () => {
      if (el) {
        try {
          observer.unobserve(el);
        } catch {
          // Ignore error if element is already unobserved/removed
        }
      }
    };
  }, [options]);

  return [ref, isInView] as const;
}
