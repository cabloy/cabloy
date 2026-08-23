import type { TableIdentity } from 'table-identity';

import { CacheRedis, ServiceCacheRedisBase } from 'vona-module-a-cache';

export type TCacheRedisPasswordSetKey = string;

export interface TCacheRedisPasswordSetData {
  purpose: 'password-set';
  userId: TableIdentity;
  consumerPath: '/home/user/password-set';
  email: string;
  pendingEmail?: string;
}

@CacheRedis({
  ttl: 15 * 60 * 1000,
  disableTransactionCompensate: true,
})
export class CacheRedisPasswordSet extends ServiceCacheRedisBase<
  TCacheRedisPasswordSetKey,
  TCacheRedisPasswordSetData
> {}
