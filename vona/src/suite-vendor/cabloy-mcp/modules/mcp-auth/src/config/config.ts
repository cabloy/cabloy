import type { IMcpAuthConfig } from '../types/index.ts';

export function config(): IMcpAuthConfig {
  return {
    registration: {
      maxBodyBytes: 16384,
      maxRedirectUris: 16,
      rateLimit: 10,
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
