import type { VonaApplication } from 'vona';

import type { IMcpAuthConfig } from '../types/index.ts';

export function config(_app: VonaApplication): IMcpAuthConfig {
  return {
    registration: {
      maxBodyBytes: 16384,
      maxRedirectUris: 16,
      rateLimit: 10,
      rateLimitWindow: 600,
    },
    pendingTtl: 600,
    codeTtl: 60,
    tokenTtl: 900,
    allowLoopbackHttp: true,
  };
}
