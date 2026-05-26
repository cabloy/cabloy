import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { cast } from 'vona';
import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

import type { IDecoratorCacheMemOptions } from '../types/cacheMem.ts';

export interface TypeBroadcastMemClearJobData {
  cacheName: string;
  cacheOptions: IDecoratorCacheMemOptions;
}

@Broadcast()
export class BroadcastMemClear
  extends BeanBroadcastBase<TypeBroadcastMemClearJobData>
  implements IBroadcastExecute<TypeBroadcastMemClearJobData>
{
  async execute(data: TypeBroadcastMemClearJobData, isEmitter?: boolean) {
    const { cacheName, cacheOptions } = data;
    if (!isEmitter) {
      const cache = this.app.bean.cache.mem(cacheName, cacheOptions);
      cast(cache).__clearRaw();
    }
  }
}
