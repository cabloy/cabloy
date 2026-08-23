import { CacheRedis, ServiceCacheRedisBase } from 'vona-module-a-cache';

export type TCacheRedisPasswordResetRecipientKey = string;
export type TCacheRedisPasswordResetRecipientData = true;

@CacheRedis({
  ttl: 60 * 1000,
  disableTransactionCompensate: true,
})
export class CacheRedisPasswordResetRecipient extends ServiceCacheRedisBase<
  TCacheRedisPasswordResetRecipientKey,
  TCacheRedisPasswordResetRecipientData
> {}
