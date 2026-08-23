import type { TableIdentity } from 'table-identity';

import { CacheRedis, ServiceCacheRedisBase } from 'vona-module-a-cache';

export type TCacheRedisActivationCurrentKey = TableIdentity;
export type TCacheRedisActivationCurrentData = string;

@CacheRedis({
  ttl: 15 * 60 * 1000,
  disableTransactionCompensate: true,
})
export class CacheRedisActivationCurrent extends ServiceCacheRedisBase<
  TCacheRedisActivationCurrentKey,
  TCacheRedisActivationCurrentData
> {}
