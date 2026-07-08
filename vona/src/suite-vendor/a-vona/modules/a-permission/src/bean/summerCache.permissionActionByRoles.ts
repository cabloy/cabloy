import type { ISummerCacheGet, TSummerCacheActionOptions } from 'vona-module-a-summer';

import { ServiceSummerCacheBase, SummerCache } from 'vona-module-a-summer';

export type TSummerCachePermissionActionByRolesKey = any;
export type TSummerCachePermissionActionByRolesData = any;

@SummerCache()
export class SummerCachePermissionActionByRoles
  extends ServiceSummerCacheBase<
    TSummerCachePermissionActionByRolesKey,
    TSummerCachePermissionActionByRolesData
  >
  implements
    ISummerCacheGet<
      TSummerCachePermissionActionByRolesKey,
      TSummerCachePermissionActionByRolesData
    >
{
  async getNative(
    _key?: TSummerCachePermissionActionByRolesKey,
    _options?: TSummerCacheActionOptions<
      TSummerCachePermissionActionByRolesKey,
      TSummerCachePermissionActionByRolesData
    >,
  ): Promise<TSummerCachePermissionActionByRolesData | undefined> {}
}
