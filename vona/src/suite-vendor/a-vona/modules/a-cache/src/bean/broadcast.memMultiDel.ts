import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { cast } from 'vona';
import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

import type { IDecoratorCacheMemOptions } from '../types/cacheMem.ts';

export interface TypeBroadcastMemMultiDelJobData {
  cacheName: string;
  cacheOptions: IDecoratorCacheMemOptions;
  keysHash: string[];
  keys: unknown[];
}

@Broadcast()
export class BroadcastMemMultiDel
  extends BeanBroadcastBase<TypeBroadcastMemMultiDelJobData>
  implements IBroadcastExecute<TypeBroadcastMemMultiDelJobData>
{
  async execute(data: TypeBroadcastMemMultiDelJobData, isEmitter?: boolean) {
    const { cacheName, cacheOptions, keysHash, keys } = data;
    if (!isEmitter) {
      const cache = this.app.bean.cache.mem(cacheName, cacheOptions);
      cast(cache).__mdelRaw(keysHash, keys);
    }
  }
}
