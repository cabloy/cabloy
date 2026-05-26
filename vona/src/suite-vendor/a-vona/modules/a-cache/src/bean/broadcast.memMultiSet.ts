import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { cast } from 'vona';
import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

import type { ICacheMemSetOptions } from '../types/cache.ts';
import type { IDecoratorCacheMemOptions } from '../types/cacheMem.ts';

export interface TypeBroadcastMemMultiSetJobData {
  cacheName: string;
  cacheOptions: IDecoratorCacheMemOptions;
  values: unknown[];
  keysHash: string[];
  keys: unknown[];
  options: ICacheMemSetOptions;
}

@Broadcast()
export class BroadcastMemMultiSet
  extends BeanBroadcastBase<TypeBroadcastMemMultiSetJobData>
  implements IBroadcastExecute<TypeBroadcastMemMultiSetJobData>
{
  async execute(data: TypeBroadcastMemMultiSetJobData, isEmitter?: boolean) {
    const { cacheName, cacheOptions, values, keysHash, keys, options } = data;
    if (!isEmitter) {
      const cache = this.app.bean.cache.mem(cacheName, cacheOptions);
      cast(cache).__msetRaw(values, keysHash, keys, options);
    }
  }
}
