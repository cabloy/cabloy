import type { VonaApplication } from 'vona';

import type { IMcpAuthConfig } from '../types/index.ts';

export function config(_app: VonaApplication): IMcpAuthConfig {
  return {
    issuer: '',
    resources: [],
    clients: [],
    pendingTtl: 600,
    codeTtl: 60,
    tokenTtl: 900,
    allowLoopbackHttp: false,
  };
}
