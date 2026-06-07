import { ServiceCacheRedisBase, CacheRedis } from 'vona-module-a-cache';

export type TCacheRedisWorkerAliveKey = string;
export type TCacheRedisWorkerAliveData = boolean;

@CacheRedis({
  disableInstance: true,
  disableTransactionCompensate: true,
  client: 'worker',
})
export class CacheRedisWorkerAlive extends ServiceCacheRedisBase<
  TCacheRedisWorkerAliveKey,
  TCacheRedisWorkerAliveData
> {}
