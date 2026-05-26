import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IDecoratorSummerCacheOptions } from '../types/summerCache.ts';

import { BeanSummerCacheBase } from './bean.summerCacheBase.ts';

@Bean()
export class BeanSummer extends BeanBase {
  cache<KEY, DATA>(
    cacheName: string,
    cacheOptions?: IDecoratorSummerCacheOptions,
  ): BeanSummerCacheBase<KEY, DATA> {
    if (cacheName.includes('.summerCache.')) {
      return this.app.bean._getBeanSelector(cacheName as any, undefined, cacheOptions);
    }
    return this.app.bean._getBeanSelector(BeanSummerCacheBase, cacheName, cacheOptions);
  }
}
