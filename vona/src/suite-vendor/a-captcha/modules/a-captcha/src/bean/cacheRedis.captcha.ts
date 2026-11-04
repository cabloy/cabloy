import { ServiceCacheRedisBase, CacheRedis } from 'vona-module-a-cache';

import type { ICaptchaDataCache } from '../types/captcha.ts';

import { captchaCasLua, captchaProofLua, captchaPublishLua } from '../lib/captchaLua.ts';

export type TCacheRedisCaptchaKey = string;
export type TCacheRedisCaptchaData = ICaptchaDataCache;

export interface ICaptchaSnapshot<T = ICaptchaDataCache> {
  raw: string;
  data: T;
}

@CacheRedis({ disableTransactionCompensate: true, updateAgeOnGet: false })
export class CacheRedisCaptcha extends ServiceCacheRedisBase<
  TCacheRedisCaptchaKey,
  TCacheRedisCaptchaData
> {
  async snapshot<T = ICaptchaDataCache>(id: string): Promise<ICaptchaSnapshot<T> | undefined> {
    const { redis, keys } = this._redisKeys([id]);
    const raw = await redis.get(keys[0]);
    return raw ? { raw, data: JSON.parse(raw) } : undefined;
  }

  async writeProof<T>(id: string, data: T, ttl: number, snapshot?: ICaptchaSnapshot<T>) {
    this._validateTtl(ttl);
    const result = (await this._eval(
      captchaProofLua,
      [id],
      [snapshot?.raw ?? '', JSON.stringify(data), ttl],
    )) as [number, number, number];
    return { changed: result[0] === 1, serverNow: result[1], expiresAt: result[2] };
  }

  async publish(id: string, data: ICaptchaDataCache, expiresAt: number) {
    if (!Number.isSafeInteger(expiresAt) || expiresAt <= 0) {
      throw new Error('invalid captcha expiry');
    }
    const result = (await this._eval(
      captchaPublishLua,
      [id],
      [JSON.stringify(data), expiresAt],
    )) as [number, number];
    if (result[0] === -1) throw new Error('captcha identity collision');
    return { published: result[0] === 1, serverNow: result[1] };
  }

  async compareAndSet<T>(id: string, snapshot: ICaptchaSnapshot<T>, data?: T, ttl?: number) {
    if (ttl !== undefined) this._validateTtl(ttl);
    const result = await this._eval(
      captchaCasLua,
      [id],
      [snapshot.raw, data === undefined ? '' : JSON.stringify(data), ttl ?? 0],
    );
    return result === 1;
  }

  private _validateTtl(ttl: number) {
    if (!Number.isSafeInteger(ttl) || ttl <= 0 || ttl > Number.MAX_SAFE_INTEGER - Date.now()) {
      throw new Error('invalid captcha ttl');
    }
  }

  private _redisKeys(ids: string[]) {
    const redis = this.__cacheInstance;
    if (!redis) throw new Error('captcha cache not enabled');
    return { redis, keys: ids.map(id => this.getRedisKey(id)!) };
  }

  private async _eval(lua: string, ids: string[], args: Array<string | number>) {
    const { redis, keys } = this._redisKeys(ids);
    return await redis.eval(lua, keys.length, ...keys, ...args);
  }
}
