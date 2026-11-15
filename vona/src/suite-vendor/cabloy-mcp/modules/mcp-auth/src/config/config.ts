import type { VonaApplication } from 'vona';

import type { IMcpAuthConfig } from '../types/index.ts';

export function config(app?: VonaApplication): IMcpAuthConfig {
  return {
    registration: {
      maxBodyBytes: 16384,
      maxRedirectUris: 16,
      // Keep a bounded test budget for managed browser scenarios and worker retries.
      rateLimit: app?.meta.isTest ? 100 : 10,
      rateLimitWindow: 600,
    },
    pendingTtl: 600,
    codeTtl: 60,
    tokenTtl: 2 * 60 * 60,
    personalTokenTtl: 7 * 24 * 60 * 60,
    refreshTokenTtl: 7 * 24 * 60 * 60,
    allowLoopbackHttp: true,
  };
}
