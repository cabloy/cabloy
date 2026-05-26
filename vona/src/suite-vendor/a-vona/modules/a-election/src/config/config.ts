import type { VonaApplication } from 'vona';

export function config(app: VonaApplication) {
  return {
    obtain: {
      timeout: app.meta.isProd ? 3000 : 300,
    },
  };
}
