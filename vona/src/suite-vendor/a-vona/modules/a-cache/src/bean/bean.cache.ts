import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IDecoratorCacheMemOptions } from '../types/cacheMem.ts';
import type { IDecoratorCacheRedisOptions } from '../types/cacheRedis.ts';

import { ServiceCacheMemBase } from '../service/cacheMemBase_.ts';
import { ServiceCacheRedisBase } from '../service/cacheRedisBase_.ts';
@Bean()
export class BeanCache extends BeanBase {
  mem<KEY, DATA>(
    cacheName: string,
    cacheOptions?: IDecoratorCacheMemOptions,
  ): ServiceCacheMemBase<KEY, DATA> {
    if (cacheName.includes('.cacheMem.')) {
      return this.app.bean._getBeanSelector(cacheName as any, undefined, cacheOptions);
    }
    return this.app.bean._getBeanSelector(ServiceCacheMemBase, cacheName, cacheOptions);
  }

  redis<KEY, DATA>(
    cacheName: string,
    cacheOptions?: IDecoratorCacheRedisOptions,
  ): ServiceCacheRedisBase<KEY, DATA> {
    if (cacheName.includes('.cacheRedis.')) {
      return this.app.bean._getBeanSelector(cacheName as any, undefined, cacheOptions);
    }
    return this.app.bean._getBeanSelector(ServiceCacheRedisBase, cacheName, cacheOptions);
  }
}
