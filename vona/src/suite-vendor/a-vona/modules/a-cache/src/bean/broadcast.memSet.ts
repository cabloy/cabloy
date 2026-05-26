import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { cast } from 'vona';
import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

import type { ICacheMemSetOptions } from '../types/cache.ts';
import type { IDecoratorCacheMemOptions } from '../types/cacheMem.ts';

export interface TypeBroadcastMemSetJobData {
  cacheName: string;
  cacheOptions: IDecoratorCacheMemOptions;
  value: unknown;
  keyHash: string;
  key: unknown;
  options: ICacheMemSetOptions;
}

@Broadcast()
export class BroadcastMemSet
  extends BeanBroadcastBase<TypeBroadcastMemSetJobData>
  implements IBroadcastExecute<TypeBroadcastMemSetJobData>
{
  async execute(data: TypeBroadcastMemSetJobData, isEmitter?: boolean) {
    const { cacheName, cacheOptions, value, keyHash, key, options } = data;
    if (!isEmitter) {
      const cache = this.app.bean.cache.mem(cacheName, cacheOptions);
      cast(cache).__setRaw(value, keyHash, key, options);
    }
  }
}
