import type { Next } from 'vona';
import type { IAopMethodExecute, IDecoratorAopMethodOptions } from 'vona-module-a-aspect';

import { BeanAopMethodBase, beanFullNameFromOnionName } from 'vona';
import { AopMethod } from 'vona-module-a-aspect';

import type { TypeCacheValueFn, TypeCachingActionOptions } from '../types/caching.ts';

import { combineCachingKey, combineCachingValue, isCachingKeyValid } from '../lib/utils.ts';

export interface IAopMethodOptionsCachingSet
  extends IDecoratorAopMethodOptions, TypeCachingActionOptions {
  cacheValue?: any;
  cacheValueFn?: TypeCacheValueFn | string;
}

@AopMethod<IAopMethodOptionsCachingSet>()
export class AopMethodCachingSet extends BeanAopMethodBase implements IAopMethodExecute {
  async execute(
    options: IAopMethodOptionsCachingSet,
    args: [],
    next: Next,
    receiver: any,
    prop: string,
  ): Promise<any> {
    if (!options.cacheName)
      throw new Error(`Should specify cacheName for caching: ${receiver.$beanFullName}#${prop}`);
    // next
    const result = await next();
    // key
    const key = combineCachingKey({ args, receiver, prop, intention: 'set' }, options);
    if (!isCachingKeyValid(key)) return result;
    // value
    const cacheValue = combineCachingValue(
      { args, receiver, prop, result, intention: 'set' },
      options,
    );
    // cache
    const cache = this.bean.summer.cache(
      beanFullNameFromOnionName(options.cacheName, 'summerCache'),
    );
    await cache.set(cacheValue, key, options);
    // ok
    return result;
  }
}
