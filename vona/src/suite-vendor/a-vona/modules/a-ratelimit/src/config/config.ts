import type { VonaApplication } from 'vona';

import type { IRateLimitPolicy } from '../types/rateLimit.ts';

export function config(_app: VonaApplication) {
  const rateLimit: IRateLimitPolicy = {
    mode: 'disabled',
    client: 'limiter',
    limit: 120,
    windowMs: 60_000,
    key: 'identity',
    headers: true,
    failureMode: 'closed',
  };
  return {
    rateLimit,
  };
}
