import type { VonaApplication } from 'vona';
import type { IOnionOptionsMeta } from 'vona-module-a-onion';

import type { IDecoratorSummerCacheOptions, TSummerCachePreset } from '../types/summerCache.ts';

export const configMem = {
  mode: 'mem', // only mem
  mem: {
    max: 50,
    broadcastOnSet: 'del',
  },
} as IDecoratorSummerCacheOptions;

export const configRedis = {
  mode: 'redis', // only redis
  redis: {
    ttl: 10 * 60 * 1000, // 10 minutes
  },
} as IDecoratorSummerCacheOptions;

export const configAll = {
  mode: 'all',
  mem: {
    max: 50,
    broadcastOnSet: 'del',
  },
  redis: {
    ttl: 10 * 60 * 1000, // 10 minutes
  },
} as IDecoratorSummerCacheOptions;

export function config(_app: VonaApplication) {
  return {
    summer: {
      enable: true,
      meta: {} as IOnionOptionsMeta,
      presetDefault: 'all' as TSummerCachePreset,
      preset: {
        mem: configMem,
        redis: configRedis,
        all: configAll,
      },
      redis: {
        client: 'summer',
      },
    },
  };
}
