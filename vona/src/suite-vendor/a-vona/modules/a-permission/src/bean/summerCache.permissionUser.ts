import type { ISummerCacheGet, TSummerCacheActionOptions } from 'vona-module-a-summer';

import { ServiceSummerCacheBase, SummerCache } from 'vona-module-a-summer';

export type TSummerCachePermissionUserKey = any;
export type TSummerCachePermissionUserData = any;

@SummerCache()
export class SummerCachePermissionUser
  extends ServiceSummerCacheBase<TSummerCachePermissionUserKey, TSummerCachePermissionUserData>
  implements ISummerCacheGet<TSummerCachePermissionUserKey, TSummerCachePermissionUserData>
{
  async getNative(
    _key?: TSummerCachePermissionUserKey,
    _options?: TSummerCacheActionOptions<
      TSummerCachePermissionUserKey,
      TSummerCachePermissionUserData
    >,
  ): Promise<TSummerCachePermissionUserData | undefined> {}
}
