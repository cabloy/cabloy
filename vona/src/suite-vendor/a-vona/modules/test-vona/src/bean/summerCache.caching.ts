import type { ISummerCacheGet, TSummerCacheActionOptions } from 'vona-module-a-summer';

import { BeanSummerCacheBase, SummerCache } from 'vona-module-a-summer';

export interface TSummerCacheCachingKey {
  id: number;
}
export interface TSummerCacheCachingData {
  id: number;
  name: string;
}

@SummerCache({
  mode: 'all',
  mem: {
    max: 2,
    ttl: 1 * 1000,
  },
  redis: {
    ttl: 3 * 1000,
  },
})
export class SummerCacheCaching
  extends BeanSummerCacheBase<TSummerCacheCachingKey, TSummerCacheCachingData>
  implements ISummerCacheGet<TSummerCacheCachingKey, TSummerCacheCachingData>
{
  async getNative(
    key?: TSummerCacheCachingKey,
    _options?: TSummerCacheActionOptions<TSummerCacheCachingKey, TSummerCacheCachingData>,
  ): Promise<TSummerCacheCachingData | undefined> {
    return {
      id: key!.id,
      name: `name_${key!.id}`,
    };
  }
}
