import type { VonaApplication } from 'vona';

export function config(_app: VonaApplication) {
  return {
    stripe: {
      secretKeyRef: 'env://STRIPE_SECRET_KEY',
      webhookSecretRef: 'env://STRIPE_WEBHOOK_SECRET',
      environment: 'sandbox' as const,
    },
  };
}
