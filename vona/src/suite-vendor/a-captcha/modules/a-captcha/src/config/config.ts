import type { VonaApplication } from 'vona';

export function config(app: VonaApplication) {
  const showToken = !app.meta.isProd;
  return {
    captchaProvider: {
      ttl: 20 * 60 * 1000,
      ttlSecondary: 20 * 60 * 1000,
    },
    captcha: {
      showToken,
    },
  };
}
