import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { cast } from 'vona';
import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

import type { IDecoratorCacheMemOptions } from '../types/cacheMem.ts';

export interface TypeBroadcastMemDelJobData {
  cacheName: string;
  cacheOptions: IDecoratorCacheMemOptions;
  keyHash: string;
  key: unknown;
}

@Broadcast()
export class BroadcastMemDel
  extends BeanBroadcastBase<TypeBroadcastMemDelJobData>
  implements IBroadcastExecute<TypeBroadcastMemDelJobData>
{
  async execute(data: TypeBroadcastMemDelJobData, isEmitter?: boolean) {
    const { cacheName, cacheOptions, keyHash, key } = data;
    if (!isEmitter) {
      const cache = this.app.bean.cache.mem(cacheName, cacheOptions);
      cast(cache).__delRaw(keyHash, key);
    }
  }
}
