import { BeanCacheRedisBase, CacheRedis } from 'vona-module-a-cache';

export type TCacheRedisStartupDebounceKey = `startupDebounce:${string}`;
export type TCacheRedisStartupDebounceData = boolean;

@CacheRedis({
  disableInstance: true,
  disableTransactionCompensate: true,
  client: 'worker',
})
export class CacheRedisStartupDebounce extends BeanCacheRedisBase<
  TCacheRedisStartupDebounceKey,
  TCacheRedisStartupDebounceData
> {}
