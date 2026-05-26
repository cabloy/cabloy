import type { BeanCacheMemBase } from 'vona-module-a-cache';

import { Service } from 'vona-module-a-bean';

import type { ICacheLayeredBase } from '../common/cacheLayeredBase.ts';
import type { TSummerCacheActionOptions } from '../types/summerCache.ts';

import { CacheBase } from '../common/cacheBase.ts';

@Service()
export class ServiceLocalMem<KEY = any, DATA = any>
  extends CacheBase<KEY, DATA>
  implements ICacheLayeredBase<KEY, DATA>
{
  private _cacheMemInstance: BeanCacheMemBase<KEY, DATA> | undefined;

  protected async __dispose__() {
    if (this._cacheMemInstance) {
      await this.bean._removeBean(this._cacheMemInstance);
      this._cacheMemInstance = undefined;
    }
  }

  get cacheMem(): BeanCacheMemBase<KEY, DATA> {
    if (!this._cacheMemInstance) {
      this._cacheMemInstance = this.app.bean.cache.mem(this._cacheName, this._cacheOptions.mem);
    }
    return this._cacheMemInstance;
  }

  async get(key?: KEY, options?: TSummerCacheActionOptions<KEY, DATA>) {
    const force = options?.force;
    let value = force
      ? undefined
      : this.cacheMem.get(key, { ttl: options?.ttl, updateAgeOnGet: options?.updateAgeOnGet });
    if (force || this.__checkValueEmpty(value, options)) {
      const layered = this.__getLayered(options);
      value = await layered.get(key, options);
      if (value === undefined) value = null as any;
      this.cacheMem.set(value!, key, {
        ttl: options?.ttl,
        db: options?.db,
        disableTransactionCompensate: options?.disableTransactionCompensate,
        broadcastOnSet: false,
      });
    }
    return value === null ? undefined : value;
  }

  async mget(keys: KEY[], options?: TSummerCacheActionOptions<KEY, DATA>) {
    const force = options?.force;
    // mget
    const values = force
      ? keys.map(() => undefined)
      : this.cacheMem.mget(keys, { ttl: options?.ttl, updateAgeOnGet: options?.updateAgeOnGet });
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
      // this.$logger.silly('-------mem:', valuesMissing);
      // set/merge
      this.cacheMem.mset(valuesMissing as any, keysMissing, {
        ttl: options?.ttl,
        db: options?.db,
        disableTransactionCompensate: options?.disableTransactionCompensate,
        broadcastOnSet: false,
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
    // set
    this.cacheMem.set(value2!, key, {
      ttl: options?.ttl,
      db: options?.db,
      disableTransactionCompensate: options?.disableTransactionCompensate,
      broadcastOnSet: options?.broadcastOnSet,
    });
    // set layered
    const layered = this.__getLayered(options);
    await layered.set(value, key, options);
  }

  async mset(
    values: DATA[],
    keys: KEY[],
    options?: TSummerCacheActionOptions<KEY, DATA>,
  ): Promise<void> {
    const values2 = values.map(item => (item === undefined ? null : item));
    // mset
    this.cacheMem.mset(values2 as any, keys, {
      ttl: options?.ttl,
      db: options?.db,
      disableTransactionCompensate: options?.disableTransactionCompensate,
      broadcastOnSet: options?.broadcastOnSet,
    });
    // mset layered
    const layered = this.__getLayered(options);
    await layered.mset(values, keys, options);
  }

  async del(key?: KEY, options?: TSummerCacheActionOptions<KEY, DATA>) {
    // del on this worker+broadcast
    this.cacheMem.del(key);
    // del layered
    const layered = this.__getLayered(options);
    await layered.del(key, options);
  }

  async mdel(keys: KEY[], options?: TSummerCacheActionOptions<KEY, DATA>) {
    // del on this worker+broadcast
    this.cacheMem.mdel(keys);
    // del layered
    const layered = this.__getLayered(options);
    await layered.mdel(keys, options);
  }

  async clear(options?: TSummerCacheActionOptions<KEY, DATA>) {
    // clear on this worker+broadcast
    this.cacheMem.clear();
    // clear layered
    const layered = this.__getLayered(options);
    await layered.clear(options);
  }

  async peek(key?: KEY, options?: TSummerCacheActionOptions<KEY, DATA>) {
    let value = this.cacheMem.peek(key);
    if (this.__checkValueEmpty(value, options)) {
      const layered = this.__getLayered(options);
      value = await layered.peek(key, options);
    }
    return value === null ? undefined : value;
  }

  __getLayered(options?: TSummerCacheActionOptions<KEY, DATA>): ICacheLayeredBase<KEY, DATA> {
    const mode = this.__getOptionsMode(options);
    if (mode === 'all') {
      return this.localRedis;
    }
    return this.localFetch;
  }
}
