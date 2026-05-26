import { BeanCacheRedisBase, CacheRedis } from 'vona-module-a-cache';

export type TCacheRedisAuthTokenKey = string;
export type TCacheRedisAuthTokenData = string;

@CacheRedis({
  ttl: 30 * 24 * 60 * 60 * 1000,
  disableTransactionCompensate: true,
})
export class CacheRedisAuthToken extends BeanCacheRedisBase<
  TCacheRedisAuthTokenKey,
  TCacheRedisAuthTokenData
> {}
