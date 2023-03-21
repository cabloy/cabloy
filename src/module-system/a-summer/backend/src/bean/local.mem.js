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

    async get(keyHash, key, options) {
      let value = this.lruCache.get(keyHash);
      if (value === undefined) {
        const layered = this.__getLayered(options);
        value = await layered.get(keyHash, key, options);
        this.lruCache.set(keyHash, value);
      }
      return value;
    }

    async mget(keysHash, keys, options) {
      // peek
      const values = keysHash.map(keyHash => this.lruCache.peek(keyHash));
      const keysHashMissing = [];
      const keysMissing = [];
      const indexesMissing = [];
      for (let i = 0; i < values.length; i++) {
        if (values[i] === undefined) {
          keysHashMissing.push(keysHash[i]);
          keysMissing.push(keys[i]);
          indexesMissing.push(i);
        }
      }
      // mget
      if (keysHashMissing.length > 0) {
        const layered = this.__getLayered(options);
        const valuesMissing = await layered.mget(keysHashMissing, keysMissing, options);
        console.log('-------mem:', valuesMissing);
        // set/merge
        for (let i = 0; i < keysHashMissing.length; i++) {
          const valueMissing = valuesMissing[i];
          this.lruCache.set(keysHashMissing[i], valueMissing);
          values[indexesMissing[i]] = valueMissing;
        }
      }
      // ok
      return values;
    }

    async peek(keyHash, key, options) {
      let value = this.lruCache.peek(keyHash);
      if (value === undefined) {
        const layered = this.__getLayered(options);
        value = await layered.peek(keyHash, key, options);
      }
      return value;
    }

    __getLayered(options) {
      const mode = this.__getOptionsMode(options);
      if (mode === 'all') {
        return this.localRedis;
      }
      return this.localFetch;
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
