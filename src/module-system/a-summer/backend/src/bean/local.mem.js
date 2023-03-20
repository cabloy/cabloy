const require3 = require('require3');
const LRUCache = require3('lru-cache');
const CacheBase = require('../common/cacheBase.js');

const SUMMERCACHEMEMORY = Symbol('APP#__SUMMERCACHEMEMORY');

module.exports = ctx => {
  class LocalMem extends CacheBase(ctx) {
    constructor({ cacheBase }) {
      super({ cacheBase });
      this._lruCache = null;
    }

    async get(keyHash) {
      let value = this.lruCache.get(keyHash);
      if (value === undefined) {
        value = await this.layered.get(keyHash);
        this.lruCache.set(keyHash, value);
      }
      return value;
    }

    get layered() {
      if (!this._layered) {
        const mode = this._cacheBase.mode || 'all';
        if (mode === 'all') {
          this._layered = this.localRedis;
        } else {
          this._layered = this.localFetch;
        }
      }
      return this._layered;
    }

    get lruCache() {
      if (!this._lruCache) {
        this._lruCache = this.memoryInstance[this._cacheBase.fullKey];
        if (!this._lruCache) {
          this._lruCache = this.memoryInstance[this._cacheBase.fullKey] = new LRUCache(this._cacheBase.mem);
        }
      }
      return this._lruCache;
    }

    get memoryInstance() {
      if (!ctx.app[SUMMERCACHEMEMORY]) {
        ctx.app[SUMMERCACHEMEMORY] = {};
      }
      if (!ctx.app[SUMMERCACHEMEMORY][ctx.subdomain]) {
        ctx.app[SUMMERCACHEMEMORY][ctx.subdomain] = {};
      }
      return ctx.app[SUMMERCACHEMEMORY][ctx.subdomain];
    }
  }

  return LocalMem;
};
