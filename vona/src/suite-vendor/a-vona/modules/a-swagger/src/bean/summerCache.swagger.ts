import type { ISummerCacheGet, TSummerCacheActionOptions } from 'vona-module-a-summer';

import { BeanSummerCacheBase, SummerCache } from 'vona-module-a-summer';

export type TSummerCacheSwaggerKey = any;
export type TSummerCacheSwaggerData = any;

@SummerCache({ preset: 'mem' })
export class SummerCacheSwagger
  extends BeanSummerCacheBase<TSummerCacheSwaggerKey, TSummerCacheSwaggerData>
  implements ISummerCacheGet<TSummerCacheSwaggerKey, TSummerCacheSwaggerData>
{
  async getNative(
    _key?: TSummerCacheSwaggerKey,
    _options?: TSummerCacheActionOptions<TSummerCacheSwaggerKey, TSummerCacheSwaggerData>,
  ): Promise<TSummerCacheSwaggerData | undefined> {}
}
