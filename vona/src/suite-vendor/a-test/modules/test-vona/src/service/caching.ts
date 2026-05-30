import type {
  ICachingActionKeyInfo,
  ICachingActionValueInfo,
  TypeCachingActionOptions,
} from 'vona-module-a-caching';

import { cel } from '@cabloy/utils';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Caching } from 'vona-module-a-caching';

import type { TSummerCacheTestData } from '../bean/summerCache.test.ts';

function cacheKeyFn(
  this: ServiceCaching,
  info: ICachingActionKeyInfo,
  _options: TypeCachingActionOptions,
): any {
  return info.args[0];
}

@Service()
export class ServiceCaching extends BeanBase {
  cacheKey(info: ICachingActionKeyInfo, _options: TypeCachingActionOptions) {
    return info.args[0];
  }

  cacheValue(info: ICachingActionValueInfo, _options: TypeCachingActionOptions) {
    return info.args[1];
  }

  @Caching.get({ cacheName: 'test-vona:caching', cacheKeyFn: 'cacheKey' })
  async get(id: number): Promise<TSummerCacheTestData> {
    return {
      id,
      name: `name_${id}`,
    };
  }

  @Caching.get({ cacheName: 'test-vona:caching', cacheKeyFn })
  async get2(_id: number): Promise<TSummerCacheTestData> {
    return undefined as any;
  }

  @Caching.get({ cacheName: 'test-vona:caching', cacheKey: cel('args[0]') })
  async get3(_id: number): Promise<TSummerCacheTestData> {
    return undefined as any;
  }

  // default cacheKey
  @Caching.get({ cacheName: 'test-vona:caching' })
  async get4(_id: number): Promise<TSummerCacheTestData> {
    return undefined as any;
  }

  @Caching.set({
    cacheName: 'test-vona:caching',
    cacheKeyFn: 'cacheKey',
    cacheValueFn: 'cacheValue',
  })
  async set(_id: number, _value: TSummerCacheTestData): Promise<void> {
    // do nothing
  }

  //
  @Caching.set({
    cacheName: 'test-vona:caching',
    cacheKey: cel('args[0]'),
    cacheValue: cel('{"id": args[1].id, "name": args[1].name}'),
  })
  async set2(_id: number, _value: TSummerCacheTestData): Promise<void> {
    // do nothing
  }

  @Caching.set({ cacheName: 'test-vona:caching', cacheKeyFn: 'cacheKey' })
  async set3(_id: number, value: TSummerCacheTestData): Promise<TSummerCacheTestData> {
    return value;
  }

  @Caching.del({ cacheName: 'test-vona:caching' })
  async del(_id: number): Promise<void> {
    // do nothing
  }

  @Caching.clear({ cacheName: 'test-vona:caching' })
  async clear(): Promise<void> {
    // do nothing
  }
}
