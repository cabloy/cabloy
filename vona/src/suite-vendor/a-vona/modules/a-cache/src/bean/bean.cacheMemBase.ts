import { LRUCache } from 'lru-cache';
import { Virtual } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { ICacheMemGetOptions, ICacheMemSetOptions } from '../types/cache.ts';
import type { IDecoratorCacheMemOptions } from '../types/cacheMem.ts';

import { CacheBase } from '../common/cacheBase.ts';
import { getCacheMemories } from '../lib/const.ts';

@Bean()
@Virtual()
export class BeanCacheMemBase<KEY = any, DATA = any> extends CacheBase<
  IDecoratorCacheMemOptions,
  KEY
> {
  protected __init__(cacheName?: string, cacheOptions?: IDecoratorCacheMemOptions) {
    super.__init__(cacheName, cacheOptions);
    this._cacheOptions = Object.assign(
      {},
      this.$scope.cache.config.mem.options,
      this._cacheOptions,
    );
  }

  protected async __dispose__() {
    // special for hmr reload
    const cacheMemories = getCacheMemories(this.app);
    delete cacheMemories[this._cacheName];
  }

  private get lruCache(): LRUCache<string, any> {
    const iid = this.__getInstanceIdScope();
    const cacheMemories = getCacheMemories(this.app);
    if (!cacheMemories[this._cacheName]) cacheMemories[this._cacheName] = {};
    if (!cacheMemories[this._cacheName][iid]) {
      cacheMemories[this._cacheName][iid] = new LRUCache<string, any>({
        max: this._cacheOptions.max,
        ttl: this._cacheOptions.ttl,
        updateAgeOnGet: this._cacheOptions.updateAgeOnGet,
        updateAgeOnHas: this._cacheOptions.updateAgeOnHas,
        ttlAutopurge: true,
      } as any);
    }
    return cacheMemories[this._cacheName][iid];
  }

  protected get __cacheInstance(): LRUCache<string, any> | undefined {
    if (!this.__cacheEnabled) return undefined;
    return this.lruCache;
  }

  public get(key?: KEY, options?: ICacheMemGetOptions): DATA | undefined {
    const cache = this.__cacheInstance;
    if (!cache) return undefined;
    const keyHash = this.__getKeyHash(key);
    const _value = cache.get(keyHash, options);
    return _value ? JSON.parse(_value) : undefined;
  }

  public mget(keys: KEY[], options?: ICacheMemGetOptions): Array<DATA | undefined> {
    if (!keys || keys.length === 0) return [];
    const cache = this.__cacheInstance;
    if (!cache) return [];
    const keysHash = this.__getKeysHash(keys);
    return keysHash.map(keyHash => {
      const _value = cache.get(keyHash, options);
      return _value ? JSON.parse(_value) : undefined;
    });
  }

  public peek(key?: KEY): DATA | undefined {
    const cache = this.__cacheInstance;
    if (!cache) return undefined;
    const keyHash = this.__getKeyHash(key);
    const _value = cache.peek(keyHash);
    return _value ? JSON.parse(_value) : undefined;
  }

  public set(value?: DATA, key?: KEY, options?: ICacheMemSetOptions): void {
    const cache = this.__cacheInstance;
    if (!cache) return;
    const keyHash = this.__getKeyHash(key);
    const ttl = options?.ttl ?? this._cacheOptions.ttl;
    const broadcastOnSet = options?.broadcastOnSet ?? this._cacheOptions.broadcastOnSet;
    cache.set(keyHash, JSON.stringify(value), { ttl });
    if (broadcastOnSet) {
      if (broadcastOnSet === 'del') {
        this.$scope.cache.broadcast.memDel.emit({
          cacheName: this._cacheName,
          cacheOptions: this._cacheOptions,
          keyHash,
          key,
        });
      } else {
        this.$scope.cache.broadcast.memSet.emit({
          cacheName: this._cacheName,
          cacheOptions: this._cacheOptions,
          value,
          keyHash,
          key,
          options: { ttl },
        });
      }
    }
    const disableTransactionCompensate =
      options?.disableTransactionCompensate ?? this._cacheOptions.disableTransactionCompensate;
    if (!disableTransactionCompensate) {
      const db = options?.db ?? this.bean.database.current;
      db?.compensate(() => {
        this.del(key);
      });
    }
  }

  public mset(values: DATA[], keys: KEY[], options?: ICacheMemSetOptions): void {
    if (!values || values.length === 0) return;
    if (!keys || keys.length === 0) return;
    const cache = this.__cacheInstance;
    if (!cache) return;
    const ttl = options?.ttl ?? this._cacheOptions.ttl;
    const broadcastOnSet = options?.broadcastOnSet ?? this._cacheOptions.broadcastOnSet;
    const keysHash: string[] = [];
    for (let i = 0; i < keys.length; i++) {
      const keyHash = this.__getKeyHash(keys[i]);
      keysHash.push(keyHash);
      cache.set(keyHash, JSON.stringify(values[i]), { ttl });
    }
    if (broadcastOnSet) {
      if (broadcastOnSet === 'del') {
        this.$scope.cache.broadcast.memMultiDel.emit({
          cacheName: this._cacheName,
          cacheOptions: this._cacheOptions,
          keysHash,
          keys,
        });
      } else {
        this.$scope.cache.broadcast.memMultiSet.emit({
          cacheName: this._cacheName,
          cacheOptions: this._cacheOptions,
          values,
          keysHash,
          keys,
          options: { ttl },
        });
      }
    }
    const disableTransactionCompensate =
      options?.disableTransactionCompensate ?? this._cacheOptions.disableTransactionCompensate;
    if (!disableTransactionCompensate) {
      const db = options?.db ?? this.bean.database.current;
      db?.compensate(() => {
        this.mdel(keys);
      });
    }
  }

  public getset(value?: DATA, key?: KEY, options?: ICacheMemSetOptions): DATA | undefined {
    const cache = this.__cacheInstance;
    if (!cache) return undefined;
    const valueOld = this.get(key);
    this.set(value, key, options);
    return valueOld;
  }

  has(key?: KEY): boolean {
    const cache = this.__cacheInstance;
    if (!cache) return false;
    const keyHash = this.__getKeyHash(key);
    return cache.has(keyHash);
  }

  del(key?: KEY): void {
    const cache = this.__cacheInstance;
    if (!cache) return;
    const keyHash = this.__getKeyHash(key);
    // del on this worker
    cache.delete(keyHash);
    // del on other workers by broadcast
    this.$scope.cache.broadcast.memDel.emit({
      cacheName: this._cacheName,
      cacheOptions: this._cacheOptions,
      keyHash,
      key,
    });
  }

  mdel(keys: KEY[]): void {
    if (!keys || keys.length === 0) return;
    const cache = this.__cacheInstance;
    if (!cache) return;
    const keysHash = this.__getKeysHash(keys);
    // del on this worker
    keysHash.forEach(keyHash => cache.delete(keyHash));
    // del on other workers by broadcast
    this.$scope.cache.broadcast.memMultiDel.emit({
      cacheName: this._cacheName,
      cacheOptions: this._cacheOptions,
      keysHash,
      keys,
    });
  }

  clear(): void {
    const cache = this.__cacheInstance;
    if (!cache) return;
    // clear on this worker
    cache.clear();
    // clear on other workers by broadcast
    this.$scope.cache.broadcast.memClear.emit({
      cacheName: this._cacheName,
      cacheOptions: this._cacheOptions,
    });
  }

  protected __setRaw(value: DATA, keyHash: string, _key: KEY, options: ICacheMemSetOptions) {
    const cache = this.__cacheInstance;
    if (!cache) return undefined;
    cache.set(keyHash, JSON.stringify(value), options);
  }

  protected __msetRaw(
    values: DATA[],
    keysHash: string[],
    _keys: KEY[],
    options: ICacheMemSetOptions,
  ) {
    const cache = this.__cacheInstance;
    if (!cache) return undefined;
    for (let i = 0; i < keysHash.length; i++) {
      cache.set(keysHash[i], JSON.stringify(values[i]), options);
    }
  }

  protected __delRaw(keyHash: string, _key: KEY) {
    const cache = this.__cacheInstance;
    if (!cache) return undefined;
    cache.delete(keyHash);
  }

  protected __mdelRaw(keysHash: string[], _keys: KEY[]) {
    const cache = this.__cacheInstance;
    if (!cache) return undefined;
    keysHash.forEach(keyHash => cache.delete(keyHash));
  }

  protected __clearRaw() {
    const cache = this.__cacheInstance;
    if (!cache) return undefined;
    cache.clear();
  }
}
