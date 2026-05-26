import type { OmitNever } from 'vona';
import type {
  IDecoratorCacheMemOptionsBase,
  IDecoratorCacheRedisOptionsBase,
  TypeBroadcastOnSet,
} from 'vona-module-a-cache';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';
import type { ServiceDb } from 'vona-module-a-orm';

export interface ISummerCacheRecord {}

export interface ISummerCacheGet<KEY, DATA> {
  getNative(key?: KEY, options?: TSummerCacheActionOptions<KEY, DATA>): Promise<DATA | undefined>;
  getNative(key: KEY, options?: TSummerCacheActionOptions<KEY, DATA>): Promise<DATA | undefined>;
}

export interface ISummerCacheMGet<KEY, DATA> {
  mgetNative(
    keys: KEY[],
    options?: TSummerCacheActionOptions<KEY, DATA>,
  ): Promise<Array<DATA | undefined>>;
}

export type TSummerCachePreset = 'all' | 'mem' | 'redis';
export type TSummerCacheMode = 'all' | 'mem' | 'redis';

export interface IDecoratorSummerCacheOptions extends TypeOnionOptionsEnableSimple {
  preset?: TSummerCachePreset;
  mode?: TSummerCacheMode;
  mem?: IDecoratorCacheMemOptionsBase;
  redis?: IDecoratorCacheRedisOptionsBase;
  ignoreNull?: boolean;
  emptyArrayAsNull?: boolean;
}

export interface TSummerCacheActionOptions<KEY, DATA> {
  enable?: boolean;
  mode?: TSummerCacheMode;
  ignoreNull?: boolean;
  emptyArrayAsNull?: boolean;
  db?: ServiceDb;
  ttl?: number;
  force?: boolean;
  updateAgeOnGet?: boolean;
  broadcastOnSet?: TypeBroadcastOnSet;
  disableTransactionCompensate?: boolean;
  get?: (key?: KEY, options?: TSummerCacheActionOptions<KEY, DATA>) => Promise<DATA | undefined>;
  mget?: (
    keys: KEY[],
    options?: TSummerCacheActionOptions<KEY, DATA>,
  ) => Promise<Array<DATA | undefined>>;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    summerCache: ServiceOnion<ISummerCacheRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    summerCache: OmitNever<ISummerCacheRecord>;
  }

  export interface IBeanSceneRecord {
    summerCache: never;
  }
}
