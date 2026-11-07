import type { VonaApplication } from 'vona';

import type { IMcpAuthConfig } from '../types/index.ts';

export function config(app: VonaApplication): IMcpAuthConfig {
  return {
    ssrSite: app.meta.env.MCP_AUTH_SSR_SITE as IMcpAuthConfig['ssrSite'],
    registration: {
      maxBodyBytes: 16384,
      maxRedirectUris: 16,
      rateLimit: 10,
      rateLimitWindow: 600,
    },
    pendingTtl: 600,
    codeTtl: 60,
    tokenTtl: 2 * 60 * 60,
    refreshTokenTtl: 7 * 24 * 60 * 60,
    allowLoopbackHttp: true,
  };
}
