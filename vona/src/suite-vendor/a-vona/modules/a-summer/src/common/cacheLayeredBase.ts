import type { TSummerCacheActionOptions } from '../types/summerCache.ts';

export interface ICacheLayeredBase<KEY, DATA> {
  get(key?: KEY, options?: TSummerCacheActionOptions<KEY, DATA>): Promise<DATA | undefined>;
  mget(
    keys: KEY[],
    options?: TSummerCacheActionOptions<KEY, DATA>,
  ): Promise<Array<DATA | undefined>>;
  set(value?: DATA, key?: KEY, options?: TSummerCacheActionOptions<KEY, DATA>): Promise<void>;
  mset(values: DATA[], keys: KEY[], options?: TSummerCacheActionOptions<KEY, DATA>): Promise<void>;
  del(key?: KEY, options?: TSummerCacheActionOptions<KEY, DATA>): Promise<void>;
  mdel(keys: KEY[], options?: TSummerCacheActionOptions<KEY, DATA>): Promise<void>;
  clear(options?: TSummerCacheActionOptions<KEY, DATA>): Promise<void>;
  peek(key?: KEY, options?: TSummerCacheActionOptions<KEY, DATA>): Promise<DATA | undefined>;
}
