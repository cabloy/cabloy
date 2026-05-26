import { cast } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { ICacheLayeredBase } from '../common/cacheLayeredBase.ts';
import type {
  ISummerCacheGet,
  ISummerCacheMGet,
  TSummerCacheActionOptions,
} from '../types/summerCache.ts';

import { CacheBase } from '../common/cacheBase.ts';

@Service()
export class ServiceLocalFetch<KEY = any, DATA = any>
  extends CacheBase<KEY, DATA>
  implements ICacheLayeredBase<KEY, DATA>
{
  private _cacheNativeInstance: CacheBase<KEY, DATA> | undefined;

  protected async __dispose__() {
    if (this._cacheNativeInstance) {
      await this.bean._removeBean(this._cacheNativeInstance);
      this._cacheNativeInstance = undefined;
    }
  }

  private get cacheBeanNative(): CacheBase {
    if (!this._cacheNativeInstance) {
      this._cacheNativeInstance = this.app.bean._getBean(this._cacheName as any);
    }
    return this._cacheNativeInstance!;
  }

  async get(key?: KEY, options?: TSummerCacheActionOptions<KEY, DATA>) {
    const fn_get = options?.get;
    if (fn_get) {
      return await fn_get(key, options);
    } else if (cast<ISummerCacheGet<KEY, DATA>>(this.cacheBeanNative).getNative) {
      return await cast<ISummerCacheGet<KEY, DATA>>(this.cacheBeanNative).getNative(key, options);
    }
    return undefined;
  }

  async mget(keys: KEY[], options?: TSummerCacheActionOptions<KEY, DATA>) {
    // mget
    const fn_mget = options?.mget;
    if (fn_mget) {
      return await fn_mget(keys, options);
    }
    const cacheBean = cast<ISummerCacheMGet<KEY, DATA> | undefined>(this.cacheBeanNative);
    if (cacheBean?.mgetNative) {
      return await cacheBean.mgetNative(keys, options);
    }
    // fallback
    const values: Array<DATA | undefined> = [];
    for (let i = 0; i < keys.length; i++) {
      values.push(await this.get(keys[i], options));
    }
    return values;
  }

  async peek(_key?: KEY, _options?: TSummerCacheActionOptions<KEY, DATA>) {
    // just return undefined
    return undefined;
  }

  async set(
    _value?: DATA,
    _key?: KEY,
    _options?: TSummerCacheActionOptions<KEY, DATA>,
  ): Promise<void> {
    // do nothing
  }

  async mset(
    _values: DATA[],
    _keys: KEY[],
    _options?: TSummerCacheActionOptions<KEY, DATA>,
  ): Promise<void> {
    // do nothing
  }

  async del(_key?: KEY, _options?: TSummerCacheActionOptions<KEY, DATA>) {
    // do nothing
  }

  async mdel(_keys: KEY[], _options?: TSummerCacheActionOptions<KEY, DATA>) {
    // do nothing
  }

  async clear(_options) {
    // do nothing
  }
}
