import type { TableIdentity } from 'table-identity';

import { ServiceCacheRedisBase, CacheRedis } from 'vona-module-a-cache';

import type { EntityPost } from '../entity/post.ts';

export type TCacheRedisPostKey = TableIdentity;
export type TCacheRedisPostData = Partial<EntityPost>;

@CacheRedis()
export class CacheRedisPost extends ServiceCacheRedisBase<
  TCacheRedisPostKey,
  TCacheRedisPostData
> {}
