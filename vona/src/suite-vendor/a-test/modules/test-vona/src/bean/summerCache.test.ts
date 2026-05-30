import type { ISummerCacheGet, TSummerCacheActionOptions } from 'vona-module-a-summer';

import { BeanSummerCacheBase, SummerCache } from 'vona-module-a-summer';

export interface TSummerCacheTestKey {
  id: number;
}
export interface TSummerCacheTestData {
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
export class SummerCacheTest
  extends BeanSummerCacheBase<TSummerCacheTestKey, TSummerCacheTestData>
  implements ISummerCacheGet<TSummerCacheTestKey, TSummerCacheTestData>
{
  async getNative(
    key?: TSummerCacheTestKey,
    _options?: TSummerCacheActionOptions<TSummerCacheTestKey, TSummerCacheTestData>,
  ): Promise<TSummerCacheTestData | undefined> {
    return {
      id: key!.id,
      name: `name_${key!.id}`,
    };
  }
}
