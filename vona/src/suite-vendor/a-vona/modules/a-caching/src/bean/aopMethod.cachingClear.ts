import type { Next } from 'vona';
import type { IAopMethodExecute, IDecoratorAopMethodOptions } from 'vona-module-a-aspect';

import { BeanAopMethodBase, beanFullNameFromOnionName } from 'vona';
import { AopMethod } from 'vona-module-a-aspect';

import type { TypeCachingActionClearOptions } from '../types/caching.ts';

export interface IAopMethodOptionsCachingClear
  extends IDecoratorAopMethodOptions, TypeCachingActionClearOptions {}

@AopMethod<IAopMethodOptionsCachingClear>()
export class AopMethodCachingClear extends BeanAopMethodBase implements IAopMethodExecute {
  async execute(
    options: IAopMethodOptionsCachingClear,
    _args: [],
    next: Next,
    receiver: any,
    prop: string,
  ): Promise<any> {
    if (!options.cacheName)
      throw new Error(`Should specify cacheName for caching: ${receiver.$beanFullName}#${prop}`);
    // next
    const result = await next();
    // cache
    const cache = this.bean.summer.cache(
      beanFullNameFromOnionName(options.cacheName, 'summerCache'),
    );
    await cache.clear(options);
    // ok
    return result;
  }
}
