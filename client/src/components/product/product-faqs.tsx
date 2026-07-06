'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { Typography } from '@/components/ui';
import type { ProductFAQ } from '@/lib/products/product-detail-types';
import { cn } from '@/lib/utils';

interface ProductFAQsProps {
  faqs: ProductFAQ[];
}

export function ProductFAQs({ faqs }: ProductFAQsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faqs" className="scroll-mt-24">
      <Typography variant="h3" className="mb-6">
        Frequently Asked Questions
      </Typography>

      <div className="divide-y divide-border rounded-xl border border-border bg-surface">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={faq.question}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <Typography variant="label" className="text-sm sm:text-base">
                  {faq.question}
                </Typography>
                <ChevronDown
                  className={cn(
                    'size-5 shrink-0 text-muted-foreground transition-transform',
                    isOpen && 'rotate-180'
                  )}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4">
                  <Typography variant="body-sm" className="text-muted-foreground">
                    {faq.answer}
                  </Typography>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
