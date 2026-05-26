import type { IOnionOptionsEnable } from 'vona-module-a-onion';

import { BeanBase, cast } from 'vona';

import { getKeyHash } from '../lib/utils.ts';

const SymbolCacheEnabled = Symbol('SymbolCacheEnabled');

export class CacheBase<
  CACHEOPTIONS extends IOnionOptionsEnable = IOnionOptionsEnable,
  KEY = any,
> extends BeanBase {
  protected _cacheName: string;
  protected _cacheOptions: CACHEOPTIONS;

  protected __init__(cacheName?: string, cacheOptions?: CACHEOPTIONS) {
    if (cacheName) {
      // dynamic
      this._cacheName = cacheName;
      this._cacheOptions = cacheOptions ?? ({} as CACHEOPTIONS);
    } else {
      // static
      this._cacheName = this.$beanFullName;
      this._cacheOptions = cacheOptions ?? (this.$beanOptions.options as CACHEOPTIONS) ?? {};
    }
  }

  protected get __cacheEnabled() {
    if (this[SymbolCacheEnabled] === undefined) {
      this[SymbolCacheEnabled] = this.__cacheEnabledInner();
    }
    return this[SymbolCacheEnabled];
  }

  private __cacheEnabledInner() {
    // enable
    if (!this.bean.onion.checkOnionOptionsEnabled(this._cacheOptions)) return false;
    // default
    return true;
  }

  protected get __cacheInstance(): any | undefined {
    return undefined;
  }

  protected __getKeyHash(key?: KEY | '*'): string {
    const cache = this.__cacheInstance;
    if (!cache) throw new Error('cache not enabled');
    return getKeyHash(key ?? 'default');
  }

  protected __getKeysHash(keys: KEY[]): string[] {
    return keys.map(key => this.__getKeyHash(key));
  }

  protected __getInstanceIdScope(): number {
    if (cast(this._cacheOptions).disableInstance) return 0;
    if (!this.ctx?.instance) {
      throw new Error(`should set 'disableInstance: true' for ${this._cacheName}`);
    }
    return this.ctx.instance.id;
  }
}
