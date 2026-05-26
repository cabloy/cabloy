import type { TableIdentityType } from 'table-identity';
import type { VonaApplication } from 'vona';
import type { IOnionOptionsMeta } from 'vona-module-a-onion';
import type { TSummerCachePreset } from 'vona-module-a-summer';

import { configAll, configRedis } from 'vona-module-a-summer';

import type { IDataBaseConfigDialects } from '../types/config.ts';

export function config(_app: VonaApplication) {
  return {
    sharding: {
      cache: {
        doubleDelete: true,
      },
    },
    rest: {
      query: {
        pageSize: {
          default: 20,
          max: 100,
        },
        orders: {
          default: 'createdAt,desc',
        },
      },
    },
    table: {
      identityType: 'bigint' as TableIdentityType,
    },
    model: {
      disableDeleted: false,
      disableInstance: false,
      disableCreateTime: false,
      disableUpdateTime: false,
    },
    softDeletionPrune: {
      enable: true,
      expired: 14 * 24 * 3600 * 1000,
    },
    dialects: {
      'better-sqlite3': 'a-ormdialect:betterSqlite3',
      'mysql': 'a-ormdialect:mysql',
      'mysql2': 'a-ormdialect:mysql3',
      'pg': 'a-ormdialect:pg',
    } as IDataBaseConfigDialects,
    summer: {
      enable: true,
      meta: {} as IOnionOptionsMeta,
      presetDefault: 'redis' as TSummerCachePreset,
      preset: {
        redis: configRedis,
        all: configAll,
      },
      redis: {
        client: 'model',
      },
    },
    logger: {
      maxLength: 256,
    },
  };
}
