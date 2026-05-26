import { BeanCacheRedisBase, CacheRedis } from 'vona-module-a-cache';

export type TCacheRedisTestKey = any;
export type TCacheRedisTestData = string;

@CacheRedis({ ttl: 1 * 1000 })
export class CacheRedisTest extends BeanCacheRedisBase<TCacheRedisTestKey, TCacheRedisTestData> {}
