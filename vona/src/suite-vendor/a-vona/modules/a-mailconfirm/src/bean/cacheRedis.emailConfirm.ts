import type { TableIdentity } from 'table-identity';

import { BeanCacheRedisBase, CacheRedis } from 'vona-module-a-cache';

export type TCacheRedisEmailConfirmKey = string;
export interface TCacheRedisEmailConfirmData {
  userId: TableIdentity;
  email: string;
}

@CacheRedis({
  ttl: 30 * 60 * 1000, // 30 minutes
})
export class CacheRedisEmailConfirm extends BeanCacheRedisBase<
  TCacheRedisEmailConfirmKey,
  TCacheRedisEmailConfirmData
> {}
