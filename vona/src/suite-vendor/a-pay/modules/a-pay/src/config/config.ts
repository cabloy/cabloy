import type { VonaApplication } from 'vona';

export interface IPayWebhookEndpointOptions {
  instanceName: string;
  providerName: string;
  clientName: string;
  environment: 'sandbox' | 'live';
  enabled: boolean;
}

export function config(app: VonaApplication) {
  return {
    webhooks: {
      endpoints: {
        mock: {
          instanceName: '',
          providerName: 'pay-mock:mock',
          clientName: 'default',
          environment: 'sandbox',
          enabled: app.meta.env.META_MODE !== 'prod',
        } satisfies IPayWebhookEndpointOptions,
      },
    },
  };
}
