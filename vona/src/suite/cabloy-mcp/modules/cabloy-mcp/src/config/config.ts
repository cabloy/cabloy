import type { VonaApplication } from 'vona';

import type { IMcpConfig } from '../types/index.ts';

export function config(app: VonaApplication): IMcpConfig {
  const env = app.meta.env;
  return {
    enabled: env.CABLOY_MCP_ENABLED !== 'false',
  };
}
