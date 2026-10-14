import type { VonaApplication } from 'vona';

import { resolveTestRunId } from 'vona';

export function getRedisClientKeyPrefix(clientName: string, app: VonaApplication): string {
  const mode = ['test', 'dev'].includes(app.config.meta.mode) ? '_local' : '';
  return `${clientName}_${app.name}${mode}:`;
}

export function prepareRedisClientKeyPrefix(
  keyPrefix: string | true | undefined,
  clientName: string,
  app: VonaApplication,
): string | undefined {
  const isolated = resolveTestRunId(app.meta.env.META_MODE, app.meta.env.VONA_TEST_RUN_ID);
  const specialClient =
    ['queue', 'broadcast'].includes(clientName) || clientName.startsWith('redlock');
  if (isolated && (specialClient ? keyPrefix !== undefined : keyPrefix !== true)) {
    throw new Error(`Isolated test requires a framework-managed Redis prefix: ${clientName}`);
  }
  return keyPrefix === true ? getRedisClientKeyPrefix(clientName, app) : keyPrefix;
}
