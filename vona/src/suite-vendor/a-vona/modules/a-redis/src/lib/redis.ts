import type { VonaApplication } from 'vona';

export function getRedisClientKeyPrefix(clientName: string, app: VonaApplication): string {
  const mode = ['test', 'dev'].includes(app.config.meta.mode) ? '_local' : '';
  return `${clientName}_${app.name}${mode}:`;
}

export function prepareRedisClientKeyPrefix(
  keyPrefix: string | true | undefined,
  clientName: string,
  app: VonaApplication,
): string | undefined {
  return keyPrefix === true ? getRedisClientKeyPrefix(clientName, app) : keyPrefix;
}
