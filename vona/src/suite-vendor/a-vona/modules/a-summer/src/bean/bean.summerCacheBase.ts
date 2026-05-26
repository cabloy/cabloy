import { deepExtend, Virtual } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type {
  IDecoratorSummerCacheOptions,
  TSummerCacheActionOptions,
} from '../types/summerCache.ts';

import { CacheBase } from '../common/cacheBase.ts';

@Bean()
@Virtual()
export class BeanSummerCacheBase<KEY = any, DATA = any> extends CacheBase<KEY, DATA> {
  protected __init__(cacheName?: string, cacheOptions?: IDecoratorSummerCacheOptions) {
    let _cacheName: string;
    let _cacheOptions: IDecoratorSummerCacheOptions;
    if (cacheName) {
      // dynamic
      _cacheName = cacheName;
      _cacheOptions = cacheOptions ?? {};
    } else {
      // summer cache
      _cacheName = this.$beanFullName;
      _cacheOptions =
        cacheOptions ?? (this.$beanOptions.options as IDecoratorSummerCacheOptions) ?? {};
    }
    // preset
    let preset = _cacheOptions.preset;
    if (!preset && !_cacheOptions.mode) preset = this.configModule.summer.presetDefault;
    if (preset) {
      const configPreset = this.configModule.summer.preset[preset];
      // extend
      _cacheOptions = deepExtend({}, configPreset, _cacheOptions, { preset: undefined });
    }
    // super
    super.__init__(_cacheName, _cacheOptions);
  }

  async get(key?: KEY, options?: TSummerCacheActionOptions<KEY, DATA>): Promise<DATA | undefined> {
    const layered = this.__getLayered(options);
    return await layered.get(key, options);
  }

  async mget(
    keys: KEY[],
    options?: TSummerCacheActionOptions<KEY, DATA>,
  ): Promise<Array<DATA | undefined>> {
    if (!keys || keys.length === 0) {
      return [];
    }
    const layered = this.__getLayered(options);
    return await layered.mget(keys, options);
  }

  async peek(key?: KEY, options?: TSummerCacheActionOptions<KEY, DATA>): Promise<DATA | undefined> {
    const layered = this.__getLayered(options);
    return await layered.peek(key, options);
  }

  async set(value?: DATA, key?: KEY, options?: TSummerCacheActionOptions<KEY, DATA>) {
    const layered = this.__getLayered(options);
    return await layered.set(value, key, options);
  }

  async mset(
    values: DATA[],
    keys: KEY[],
    options?: TSummerCacheActionOptions<KEY, DATA>,
  ): Promise<void> {
    if (!keys || keys.length === 0) {
      return;
    }
    const layered = this.__getLayered(options);
    return await layered.mset(values, keys, options);
  }

  async del(key?: KEY, options?: TSummerCacheActionOptions<KEY, DATA>) {
    const layered = this.__getLayered(options);
    return await layered.del(key, options);
  }

  async mdel(keys: KEY[], options?: TSummerCacheActionOptions<KEY, DATA>) {
    if (!keys || keys.length === 0) {
      return;
    }
    const layered = this.__getLayered(options);
    return await layered.mdel(keys, options);
  }

  async clear(options?: TSummerCacheActionOptions<KEY, DATA>) {
    const layered = this.__getLayered(options);
    return await layered.clear(options);
  }

  private __getLayered(options?: TSummerCacheActionOptions<KEY, DATA>) {
    if (!this.__getOptionsEnabled(options)) {
      return this.localFetch;
    }
    const mode = this.__getOptionsMode(options);
    if (mode === 'all' || mode === 'mem') {
      return this.localMem;
    }
    return this.localRedis;
  }
}
