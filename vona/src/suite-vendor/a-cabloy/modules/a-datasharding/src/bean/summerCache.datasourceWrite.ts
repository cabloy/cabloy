import type { TableIdentity } from 'table-identity';
import type { IDatabaseClientRecord } from 'vona-module-a-orm';

import { BeanSummerCacheBase, SummerCache } from 'vona-module-a-summer';

export type TSummerCacheDatasourceWriteKey = TableIdentity;
export type TSummerCacheDatasourceWriteData = keyof IDatabaseClientRecord;

@SummerCache({
  mem: {
    ttl: 3 * 1000, // 3s
  },
  redis: {
    ttl: 3 * 1000, // 3s
  },
})
export class SummerCacheDatasourceWrite extends BeanSummerCacheBase<
  TSummerCacheDatasourceWriteKey,
  TSummerCacheDatasourceWriteData
> {}
