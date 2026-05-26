import type { VonaApplication } from 'vona';

export function config(_app: VonaApplication) {
  return {
    client: {
      clientId: '',
      clientSecret: '',
      logging: false,
    },
    paypal: {
      payFeeRate: 0.1,
    },
  };
}
