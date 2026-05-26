import type { BeanCacheRedisBase } from 'vona-module-a-cache';

import { Service } from 'vona-module-a-bean';

import type { ICacheLayeredBase } from '../common/cacheLayeredBase.ts';
import type { TSummerCacheActionOptions } from '../types/summerCache.ts';

import { CacheBase } from '../common/cacheBase.ts';

@Service()
export class ServiceLocalRedis<KEY = any, DATA = any>
  extends CacheBase<KEY, DATA>
  implements ICacheLayeredBase<KEY, DATA>
{
  private _cacheRedisInstance: BeanCacheRedisBase<KEY, DATA> | undefined;

  protected async __dispose__() {
    if (this._cacheRedisInstance) {
      await this.bean._removeBean(this._cacheRedisInstance);
      this._cacheRedisInstance = undefined;
    }
  }

  get cacheRedis(): BeanCacheRedisBase<KEY, DATA> {
    if (!this._cacheRedisInstance) {
      this._cacheRedisInstance = this.app.bean.cache.redis(
        this._cacheName,
        this._cacheOptions.redis,
      );
    }
    return this._cacheRedisInstance;
  }

  async get(key?: KEY, options?: TSummerCacheActionOptions<KEY, DATA>) {
    const force = options?.force;
    let value = force
      ? undefined
      : await this.cacheRedis.get(key, {
          ttl: options?.ttl,
          updateAgeOnGet: options?.updateAgeOnGet,
        });
    if (force || this.__checkValueEmpty(value, options)) {
      const layered = this.__getLayered(options);
      value = await layered.get(key, options);
      if (value === undefined) value = null as any;
      await this.cacheRedis.set(value!, key, {
        ttl: options?.ttl,
        db: options?.db,
        disableTransactionCompensate: options?.disableTransactionCompensate,
      });
    }
    return value === null ? undefined : value;
  }

  async mget(keys: KEY[], options?: TSummerCacheActionOptions<KEY, DATA>) {
    const force = options?.force;
    // mget
    const values = force
      ? keys.map(() => undefined)
      : await this.cacheRedis.mget(keys, {
          ttl: options?.ttl,
          updateAgeOnGet: options?.updateAgeOnGet,
        });
    const keysMissing: any[] = [];
    const indexesMissing: any[] = [];
    for (let i = 0; i < values.length; i++) {
      if (force || this.__checkValueEmpty(values[i], options)) {
        keysMissing.push(keys[i]);
        indexesMissing.push(i);
      }
    }
    // mget
    if (keysMissing.length > 0) {
      const layered = this.__getLayered(options);
      let valuesMissing = await layered.mget(keysMissing, options);
      valuesMissing = valuesMissing.map(item => (item === undefined ? (null as any) : item));
      // this.$logger.silly('-------redis:', valuesMissing);
      // set/merge
      await this.cacheRedis.mset(valuesMissing as any, keysMissing, {
        ttl: options?.ttl,
        db: options?.db,
        disableTransactionCompensate: options?.disableTransactionCompensate,
      });
      for (let i = 0; i < keysMissing.length; i++) {
        const valueMissing = valuesMissing[i];
        values[indexesMissing[i]] = valueMissing;
      }
    }
    // ok
    return values.map(item => (item === null ? undefined : item));
  }

  async set(
    value?: DATA,
    key?: KEY,
    options?: TSummerCacheActionOptions<KEY, DATA>,
  ): Promise<void> {
    const value2 = value === undefined ? null : value;
    await this.cacheRedis.set(value2!, key, {
      ttl: options?.ttl,
      db: options?.db,
      disableTransactionCompensate: options?.disableTransactionCompensate,
    });
  }

  async mset(
    values: DATA[],
    keys: KEY[],
    options?: TSummerCacheActionOptions<KEY, DATA>,
  ): Promise<void> {
    const values2 = values.map(item => (item === undefined ? null : item));
    await this.cacheRedis.mset(values2 as any, keys, {
      ttl: options?.ttl,
      db: options?.db,
      disableTransactionCompensate: options?.disableTransactionCompensate,
    });
  }

  async del(key?: KEY, _options?: TSummerCacheActionOptions<KEY, DATA>) {
    await this.cacheRedis.del(key);
  }

  async mdel(keys: KEY[], _options?: TSummerCacheActionOptions<KEY, DATA>) {
    await this.cacheRedis.mdel(keys);
  }

  async clear(_options?: TSummerCacheActionOptions<KEY, DATA>) {
    await this.cacheRedis.clear();
  }

  async peek(key?: KEY, _options?: TSummerCacheActionOptions<KEY, DATA>) {
    const value = await this.cacheRedis.peek(key);
    // need not call layered.peek
    // if (this.__checkValueEmpty(value, options)) {
    //   const layered = this.__getLayered(options);
    //   value = await layered.peek(keyHash, key, options);
    // }
    return value === null ? undefined : value;
  }

  __getLayered(_options?: TSummerCacheActionOptions<KEY, DATA>) {
    return this.localFetch;
  }
}
