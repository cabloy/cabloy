import type { ISummerCacheGet, TSummerCacheActionOptions } from 'vona-module-a-summer';

import { ServiceSummerCacheBase, SummerCache } from 'vona-module-a-summer';

export type TSummerCachePermissionActionByUserKey = any;
export type TSummerCachePermissionActionByUserData = any;

@SummerCache()
export class SummerCachePermissionActionByUser
  extends ServiceSummerCacheBase<
    TSummerCachePermissionActionByUserKey,
    TSummerCachePermissionActionByUserData
  >
  implements
    ISummerCacheGet<TSummerCachePermissionActionByUserKey, TSummerCachePermissionActionByUserData>
{
  async getNative(
    _key?: TSummerCachePermissionActionByUserKey,
    _options?: TSummerCacheActionOptions<
      TSummerCachePermissionActionByUserKey,
      TSummerCachePermissionActionByUserData
    >,
  ): Promise<TSummerCachePermissionActionByUserData | undefined> {}
}
