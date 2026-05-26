import type { VonaApplication } from 'vona';
import type { IRedisClientRecord } from 'vona-module-a-redis';

export function config(_app: VonaApplication) {
  return {
    redis: {
      options: {
        client: 'cache' as keyof IRedisClientRecord,
        updateAgeOnGet: true,
      },
    },
    mem: {
      options: {
        updateAgeOnGet: true,
        updateAgeOnHas: false,
        broadcastOnSet: false,
      },
    },
  };
}
