import type { Next } from 'vona';
import type { IAopMethodExecute, IDecoratorAopMethodOptions } from 'vona-module-a-aspect';

import { BeanAopMethodBase, beanFullNameFromOnionName } from 'vona';
import { AopMethod } from 'vona-module-a-aspect';

import type { TypeCachingActionOptions } from '../types/caching.ts';

import { combineCachingKey, isCachingKeyValid } from '../lib/utils.ts';

export interface IAopMethodOptionsCachingDel
  extends IDecoratorAopMethodOptions, TypeCachingActionOptions {
  intention: 'del' | 'create';
}

@AopMethod<IAopMethodOptionsCachingDel>()
export class AopMethodCachingDel extends BeanAopMethodBase implements IAopMethodExecute {
  async execute(
    options: IAopMethodOptionsCachingDel,
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
    const key = combineCachingKey(
      { args, receiver, prop, result, intention: options.intention ?? 'del' },
      options,
    );
    if (!isCachingKeyValid(key)) return result;
    // cache
    const cache = this.bean.summer.cache(
      beanFullNameFromOnionName(options.cacheName, 'summerCache'),
    );
    await cache.del(key, options);
    // ok
    return result;
  }
}
