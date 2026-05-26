import type { ISummerCacheGet, TSummerCacheActionOptions } from 'vona-module-a-summer';

import { BeanSummerCacheBase, SummerCache } from 'vona-module-a-summer';

export type TSummerCacheJsonKey = any;
export type TSummerCacheJsonData = any;

@SummerCache({ preset: 'mem' })
export class SummerCacheJson
  extends BeanSummerCacheBase<TSummerCacheJsonKey, TSummerCacheJsonData>
  implements ISummerCacheGet<TSummerCacheJsonKey, TSummerCacheJsonData>
{
  async getNative(
    _key?: TSummerCacheJsonKey,
    _options?: TSummerCacheActionOptions<TSummerCacheJsonKey, TSummerCacheJsonData>,
  ): Promise<TSummerCacheJsonData | undefined> {}
}
