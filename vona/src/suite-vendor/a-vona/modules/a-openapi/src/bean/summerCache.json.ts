import type { ISummerCacheGet, TSummerCacheActionOptions } from 'vona-module-a-summer';

import { ServiceSummerCacheBase, SummerCache } from 'vona-module-a-summer';

export type TSummerCacheJsonKey = any;
export type TSummerCacheJsonData = any;

@SummerCache({ preset: 'mem' })
export class SummerCacheJson
  extends ServiceSummerCacheBase<TSummerCacheJsonKey, TSummerCacheJsonData>
  implements ISummerCacheGet<TSummerCacheJsonKey, TSummerCacheJsonData>
{
  async getNative(
    _key?: TSummerCacheJsonKey,
    _options?: TSummerCacheActionOptions<TSummerCacheJsonKey, TSummerCacheJsonData>,
  ): Promise<TSummerCacheJsonData | undefined> {}
}
