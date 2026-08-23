import type { TableIdentity } from 'table-identity';

import { CacheRedis, ServiceCacheRedisBase } from 'vona-module-a-cache';

export type TCacheRedisPasswordResetCurrentKey = TableIdentity;
export type TCacheRedisPasswordResetCurrentData = string;

@CacheRedis({
  ttl: 15 * 60 * 1000,
  disableTransactionCompensate: true,
})
export class CacheRedisPasswordResetCurrent extends ServiceCacheRedisBase<
  TCacheRedisPasswordResetCurrentKey,
  TCacheRedisPasswordResetCurrentData
> {}
