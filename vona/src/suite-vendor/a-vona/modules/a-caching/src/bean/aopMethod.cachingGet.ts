import type { Next } from 'vona';
import type { IAopMethodExecute, IDecoratorAopMethodOptions } from 'vona-module-a-aspect';

import { BeanAopMethodBase, beanFullNameFromOnionName } from 'vona';
import { AopMethod } from 'vona-module-a-aspect';

import type { TypeCachingActionOptions } from '../types/caching.ts';

import { combineCachingKey, isCachingKeyValid } from '../lib/utils.ts';

export interface IAopMethodOptionsCachingGet
  extends IDecoratorAopMethodOptions, TypeCachingActionOptions {}

@AopMethod<IAopMethodOptionsCachingGet>()
export class AopMethodCachingGet extends BeanAopMethodBase implements IAopMethodExecute {
  async execute(
    options: IAopMethodOptionsCachingGet,
    args: [],
    next: Next,
    receiver: any,
    prop: string,
  ): Promise<any> {
    if (!options.cacheName)
      throw new Error(`Should specify cacheName for caching: ${receiver.$beanFullName}#${prop}`);
    // key
    const key = combineCachingKey({ args, receiver, prop, intention: 'get' }, options);
    if (!isCachingKeyValid(key)) return next();
    // cache
    const cache = this.bean.summer.cache(
      beanFullNameFromOnionName(options.cacheName, 'summerCache'),
    );
    return await cache.get(
      key,
      Object.assign({}, options, {
        get: () => {
          return next();
        },
      }),
    );
  }
}
