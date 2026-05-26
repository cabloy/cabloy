import type { VonaApplication } from 'vona';

import type { ConfigRedlock } from '../types/redlock.ts';

export function config(app: VonaApplication) {
  const lockTTL = app.meta.isDev ? 8 : app.meta.isTest ? 60 : 30;
  const redlock: ConfigRedlock = {
    lockTTL: lockTTL * 1000,
    base: {
      clients: ['redlock'],
      // https://github.com/mike-marcacci/node-redlock#configuration
      options: {
        driftFactor: 0.01,
        retryCount: -1,
        retryDelay: 200,
        retryJitter: 100,
      },
    },
  };
  return redlock;
}
