import type { TableIdentity } from 'table-identity';

import { CacheRedis, ServiceCacheRedisBase } from 'vona-module-a-cache';

export type TCacheRedisActivationKey = string;

export interface TCacheRedisActivationData {
  purpose: 'account-activation';
  userId: TableIdentity;
  consumerPath: '/home/user/activation';
  email: string;
}

@CacheRedis({
  ttl: 15 * 60 * 1000,
  disableTransactionCompensate: true,
})
export class CacheRedisActivation extends ServiceCacheRedisBase<
  TCacheRedisActivationKey,
  TCacheRedisActivationData
> {}
