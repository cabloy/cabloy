import type { VonaApplication } from 'vona';

export function config(app: VonaApplication) {
  return {
    mock: {
      enabled: app.meta.env.META_MODE !== 'prod',
    },
  };
}
