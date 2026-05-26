import type { ISummerCacheGet, TSummerCacheActionOptions } from 'vona-module-a-summer';

import { BeanSummerCacheBase, SummerCache } from 'vona-module-a-summer';

export type TSummerCachePermissionKey = any;
export type TSummerCachePermissionData = any;

@SummerCache({ preset: 'mem' })
export class SummerCachePermission
  extends BeanSummerCacheBase<TSummerCachePermissionKey, TSummerCachePermissionData>
  implements ISummerCacheGet<TSummerCachePermissionKey, TSummerCachePermissionData>
{
  async getNative(
    _key?: TSummerCachePermissionKey,
    _options?: TSummerCacheActionOptions<TSummerCachePermissionKey, TSummerCachePermissionData>,
  ): Promise<TSummerCachePermissionData | undefined> {}
}
