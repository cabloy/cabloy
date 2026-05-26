import type { VonaApplication } from 'vona';

export function config(app: VonaApplication) {
  return {
    alive: {
      timeout: app.meta.isProd ? 3000 : 1000,
      timeoutMore: app.meta.isProd ? 3000 : 1000,
    },
  };
}
