const require3 = require('require3');
const LRUCache = require3('lru-cache');
const CacheBase = require('../common/cacheBase.js');

const SUMMERCACHEMEMORY = Symbol('APP#__SUMMERCACHEMEMORY');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class LocalMem extends CacheBase(ctx) {
    constructor({ cacheBase }) {
      super({ cacheBase });
      this._lruCache = null;
    }

    async get(keyHash, key, options) {
      let value = this.lruCache.get(keyHash);
      if (this.__checkValueEmpty(value, options)) {
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
        if (this.__checkValueEmpty(values[i], options)) {
          keysHashMissing.push(keysHash[i]);
          keysMissing.push(keys[i]);
          indexesMissing.push(i);
        }
      }
      // mget
      if (keysHashMissing.length > 0) {
        const layered = this.__getLayered(options);
        const valuesMissing = await layered.mget(keysHashMissing, keysMissing, options);
        // console.log('-------mem:', valuesMissing);
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

    async del(keyHash, key, options) {
      // del on this worker
      this.lruCache.delete(keyHash);
      // del on other workers by broadcast
      ctx.meta.util.broadcastEmit({
        module: moduleInfo.relativeName,
        broadcastName: 'memDel',
        data: { fullKey: this._cacheBase.fullKey, keyHash, key, options },
      });
      // del layered
      const layered = this.__getLayered(options);
      await layered.del(keyHash, key, options);
    }

    async mdel(keysHash, keys, options) {
      // del on this worker
      keysHash.forEach(keyHash => this.lruCache.delete(keyHash));
      // del on other workers by broadcast
      ctx.meta.util.broadcastEmit({
        module: moduleInfo.relativeName,
        broadcastName: 'memMultiDel',
        data: { fullKey: this._cacheBase.fullKey, keysHash, keys, options },
      });
      // del layered
      const layered = this.__getLayered(options);
      await layered.mdel(keysHash, keys, options);
    }

    async clear(options) {
      // clear on this worker
      this.lruCache.clear();
      // clear on other workers by broadcast
      ctx.meta.util.broadcastEmit({
        module: moduleInfo.relativeName,
        broadcastName: 'memClear',
        data: { fullKey: this._cacheBase.fullKey, options },
      });
      // clear layered
      const layered = this.__getLayered(options);
      await layered.clear(options);
    }

    async peek(keyHash, key, options) {
      let value = this.lruCache.peek(keyHash);
      if (this.__checkValueEmpty(value, options)) {
        const layered = this.__getLayered(options);
        value = await layered.peek(keyHash, key, options);
      }
      return value;
    }

    __delRaw(keyHash /* , key, options*/) {
      this.lruCache.delete(keyHash);
    }

    __mdelRaw(keysHash /* , keys, options*/) {
      keysHash.forEach(keyHash => this.lruCache.delete(keyHash));
    }

    __clearRaw(/* options*/) {
      this.lruCache.clear();
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
