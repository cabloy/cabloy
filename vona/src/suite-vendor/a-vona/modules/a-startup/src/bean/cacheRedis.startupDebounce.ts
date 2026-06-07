import { ServiceCacheRedisBase, CacheRedis } from 'vona-module-a-cache';

export type TCacheRedisStartupDebounceKey = `startupDebounce:${string}`;
export type TCacheRedisStartupDebounceData = boolean;

@CacheRedis({
  disableInstance: true,
  disableTransactionCompensate: true,
  client: 'worker',
})
export class CacheRedisStartupDebounce extends ServiceCacheRedisBase<
  TCacheRedisStartupDebounceKey,
  TCacheRedisStartupDebounceData
> {}
