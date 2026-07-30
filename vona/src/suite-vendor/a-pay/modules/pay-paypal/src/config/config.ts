import type { VonaApplication } from 'vona';

export function config(_app: VonaApplication) {
  return {
    paypal: {
      clientIdRef: 'env://PAYPAL_CLIENT_ID',
      clientSecretRef: 'env://PAYPAL_CLIENT_SECRET',
      webhookIdRef: 'env://PAYPAL_WEBHOOK_ID',
      environment: 'sandbox' as const,
    },
  };
}
