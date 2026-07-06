import type { PaymentConfig } from '@/types/checkout';

declare global {
  interface Window {
    Cashfree?: (config: { mode: 'sandbox' | 'production' }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: '_self' | '_blank' | '_top' | '_modal';
      }) => Promise<{ error?: { message: string } }>;
    };
  }
}

const CASHFREE_SCRIPT = 'https://sdk.cashfree.com/js/v3/cashfree.js';

function loadCashfreeScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve();
      return;
    }

    const existing = document.querySelector(`script[src="${CASHFREE_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Cashfree SDK')));
      return;
    }

    const script = document.createElement('script');
    script.src = CASHFREE_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
    document.body.appendChild(script);
  });
}

export async function launchCashfreeCheckout(
  paymentSessionId: string,
  config: PaymentConfig
): Promise<void> {
  await loadCashfreeScript();

  if (!window.Cashfree) {
    throw new Error('Cashfree SDK not available');
  }

  const cashfree = window.Cashfree({ mode: config.mode });
  const result = await cashfree.checkout({
    paymentSessionId,
    redirectTarget: '_self',
  });

  if (result?.error) {
    throw new Error(result.error.message);
  }
}
