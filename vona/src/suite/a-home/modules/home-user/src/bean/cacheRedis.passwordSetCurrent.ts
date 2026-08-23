import type { TableIdentity } from 'table-identity';

import { CacheRedis, ServiceCacheRedisBase } from 'vona-module-a-cache';

export type TCacheRedisPasswordSetCurrentKey = TableIdentity;
export type TCacheRedisPasswordSetCurrentData = string;

@CacheRedis({
  ttl: 15 * 60 * 1000,
  disableTransactionCompensate: true,
})
export class CacheRedisPasswordSetCurrent extends ServiceCacheRedisBase<
  TCacheRedisPasswordSetCurrentKey,
  TCacheRedisPasswordSetCurrentData
> {}
