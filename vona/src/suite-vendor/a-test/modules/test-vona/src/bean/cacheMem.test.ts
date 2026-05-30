import { BeanCacheMemBase, CacheMem } from 'vona-module-a-cache';

export type TCacheMemTestKey = '__immutable__' | undefined;
export type TCacheMemTestData = { name: string } | string;

@CacheMem({ ttl: 1 * 1000 })
export class CacheMemTest extends BeanCacheMemBase<TCacheMemTestKey, TCacheMemTestData> {}
