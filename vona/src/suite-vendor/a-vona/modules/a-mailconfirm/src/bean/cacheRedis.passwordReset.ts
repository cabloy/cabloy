import type { TableIdentity } from 'table-identity';

import { BeanCacheRedisBase, CacheRedis } from 'vona-module-a-cache';

export type TCacheRedisPasswordResetKey = string;
export interface TCacheRedisPasswordResetData {
  userId: TableIdentity;
}

@CacheRedis({
  ttl: 30 * 60 * 1000, // 30 minutes
})
export class CacheRedisPasswordReset extends BeanCacheRedisBase<
  TCacheRedisPasswordResetKey,
  TCacheRedisPasswordResetData
> {}
