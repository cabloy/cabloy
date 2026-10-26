import { createHash } from 'node:crypto';
import { ServiceCacheRedisBase, CacheRedis } from 'vona-module-a-cache';

import type { ICaptchaDataCache } from '../types/captcha.ts';
import type { ICaptchaAuthorization } from '../types/captchaProvider.ts';

import {
  captchaCasLua,
  captchaConsumeLua,
  captchaFinalizeLua,
  captchaReserveLua,
} from '../lib/captchaLua.ts';

export type TCacheRedisCaptchaKey = string;
export type TCacheRedisCaptchaData = ICaptchaDataCache;

export interface ICaptchaSnapshot {
  raw: string;
  data: ICaptchaDataCache;
}

@CacheRedis({ disableTransactionCompensate: true, updateAgeOnGet: false })
export class CacheRedisCaptcha extends ServiceCacheRedisBase<
  TCacheRedisCaptchaKey,
  TCacheRedisCaptchaData
> {
  async snapshot(id: string): Promise<ICaptchaSnapshot | undefined> {
    const { redis, keys } = this._redisKeys([id]);
    const raw = await redis.get(keys[0]);
    return raw ? { raw, data: JSON.parse(raw) } : undefined;
  }

  async createImage(id: string, data: ICaptchaDataCache, ttl: number) {
    this._validateTtl(ttl);
    const { redis, keys } = this._redisKeys([id]);
    return (await redis.set(keys[0], JSON.stringify(data), 'PX', ttl, 'NX')) === 'OK';
  }

  async compareAndSet(
    id: string,
    snapshot: ICaptchaSnapshot,
    data?: ICaptchaDataCache,
    ttl?: number,
  ) {
    if (ttl !== undefined) this._validateTtl(ttl);
    const result = await this._eval(
      captchaCasLua,
      [id],
      [snapshot.raw, data === undefined ? '' : JSON.stringify(data), ttl ?? 0],
    );
    return result === 1;
  }

  boundPrefix() {
    const instance = createHash('sha256').update(String(this.__getInstanceIdScope())).digest('hex');
    return `{captcha:${instance}}:`;
  }

  /** Opaque, instance-local cache keys, also available for precise test cleanup. */
  boundKeys(
    authorization: Pick<ICaptchaAuthorization, 'scope' | 'ip' | 'recipientLimits' | 'ipLimits'>,
  ) {
    const prefix = this.boundPrefix();
    return {
      pointer: `${prefix}current:${authorization.scope}`,
      cooldown: `${prefix}cooldown:${authorization.scope}`,
      budgets: [
        ...authorization.recipientLimits.map(
          limit => `${prefix}recipient:${authorization.scope}:${limit.windowMs}`,
        ),
        ...authorization.ipLimits.map(limit => `${prefix}ip:${authorization.ip}:${limit.windowMs}`),
      ],
    };
  }

  async reserveBound(id: string, data: ICaptchaDataCache, authorization: ICaptchaAuthorization) {
    this._validateAuthorization(authorization);
    this._validateBoundId(id);
    const keys = this.boundKeys(authorization);
    const policy = {
      ttl: authorization.ttl,
      cooldown: authorization.cooldown,
      budgets: [...authorization.recipientLimits, ...authorization.ipLimits],
    };
    const result = (await this._eval(
      captchaReserveLua,
      [id, keys.pointer, keys.cooldown, ...keys.budgets],
      [id, JSON.stringify(policy), JSON.stringify(data)],
    )) as [number, string, number, number];
    if (result[0] === -1) throw new Error('captcha identity collision');
    if (result[0] === 0) {
      return { reserved: false as const, retryAt: result[2], resendAt: result[3] };
    }
    if (result[0] !== 1 || !result[1]) throw new Error('invalid captcha reservation');
    return {
      reserved: true as const,
      snapshot: { raw: result[1], data: JSON.parse(result[1]) as ICaptchaDataCache },
    };
  }

  async finalizeBound(id: string, snapshot: ICaptchaSnapshot, data?: ICaptchaDataCache) {
    this._validateBoundId(id);
    const scope = snapshot.data.bound!.scope;
    const pointer = `${this.boundPrefix()}current:${scope}`;
    return (
      (await this._eval(
        captchaFinalizeLua,
        [id, pointer],
        [snapshot.raw, id, data === undefined ? '' : JSON.stringify(data)],
      )) === 1
    );
  }

  /** -1 asks the verifier to reread a competing wrong-attempt update. */
  async consumeBound(id: string, snapshot: ICaptchaSnapshot, verified: boolean) {
    this._validateBoundId(id);
    const bound = snapshot.data.bound!;
    const pointer = `${this.boundPrefix()}current:${bound.scope}`;
    const next = {
      ...snapshot.data,
      bound: {
        ...bound,
        attemptsRemaining: bound.attemptsRemaining - 1,
        version: bound.version + 1,
      },
    };
    return (await this._eval(
      captchaConsumeLua,
      [id, pointer],
      [snapshot.raw, id, verified ? '1' : '0', JSON.stringify(next)],
    )) as number;
  }

  validateAuthorization(authorization: ICaptchaAuthorization) {
    this._validateAuthorization(authorization);
  }

  private _validateAuthorization(authorization: ICaptchaAuthorization) {
    if (!authorization || typeof authorization !== 'object')
      throw new Error('invalid captcha authorization');
    const { binding, scope, ip, ttl, cooldown, maxAttempts, recipientLimits, ipLimits } =
      authorization;
    const text = (value: unknown) =>
      typeof value === 'string' && value.length > 0 && value.length <= 512;
    const hash = (value: unknown) => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
    if (
      !binding ||
      !text(binding.recipient) ||
      !text(binding.purpose) ||
      (binding.subject !== undefined && !text(binding.subject)) ||
      !hash(scope) ||
      !hash(ip)
    ) {
      throw new Error('invalid captcha binding');
    }
    this._validateTtl(ttl);
    if (
      !Number.isSafeInteger(cooldown) ||
      cooldown < 0 ||
      cooldown > Number.MAX_SAFE_INTEGER - Date.now() ||
      maxAttempts !== 5
    ) {
      throw new Error('invalid captcha policy');
    }
    for (const limits of [recipientLimits, ipLimits]) {
      if (!Array.isArray(limits) || limits.length === 0 || limits.length > 16)
        throw new Error('invalid captcha limits');
      const windows = new Set<number>();
      for (const limit of limits) {
        if (
          !limit ||
          !Number.isSafeInteger(limit.limit) ||
          limit.limit <= 0 ||
          windows.has(limit.windowMs)
        ) {
          throw new Error('invalid captcha limit');
        }
        this._validateTtl(limit.windowMs);
        windows.add(limit.windowMs);
      }
    }
  }

  private _validateTtl(ttl: number) {
    if (!Number.isSafeInteger(ttl) || ttl <= 0 || ttl > Number.MAX_SAFE_INTEGER - Date.now()) {
      throw new Error('invalid captcha ttl');
    }
  }

  private _validateBoundId(id: string) {
    if (
      !id.startsWith(this.boundPrefix()) ||
      !/^[a-f0-9-]{36}$/.test(id.slice(this.boundPrefix().length))
    ) {
      throw new Error('invalid bound captcha identity');
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
