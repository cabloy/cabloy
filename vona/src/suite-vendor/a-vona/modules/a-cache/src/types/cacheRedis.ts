import type { OmitNever } from 'vona';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';
import type { IRedisClientRecord } from 'vona-module-a-redis';

export interface ICacheRedisRecord {}

export interface IDecoratorCacheRedisOptionsBase {
  ttl?: number;
  updateAgeOnGet?: boolean;
  client?: keyof IRedisClientRecord;
  disableInstance?: boolean;
  disableTransactionCompensate?: boolean;
}

export interface IDecoratorCacheRedisOptions
  extends IDecoratorCacheRedisOptionsBase, TypeOnionOptionsEnableSimple {}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    cacheRedis: ServiceOnion<ICacheRedisRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    cacheRedis: OmitNever<ICacheRedisRecord>;
  }

  export interface IBeanSceneRecord {
    cacheRedis: never;
  }
}
