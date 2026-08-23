import type { TableIdentity } from 'table-identity';

import { CacheRedis, ServiceCacheRedisBase } from 'vona-module-a-cache';

export type TCacheRedisPasswordResetKey = string;

export interface TCacheRedisPasswordResetData {
  purpose: 'password-reset';
  userId: TableIdentity;
  consumerPath: '/home/user/password-reset';
}

@CacheRedis({
  ttl: 15 * 60 * 1000,
  disableTransactionCompensate: true,
})
export class CacheRedisPasswordReset extends ServiceCacheRedisBase<
  TCacheRedisPasswordResetKey,
  TCacheRedisPasswordResetData
> {}
