const require3 = require('require3');
const objectHash = require3('object-hash');
const CacheBase = require('../common/cacheBase.js');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class LocalCache extends CacheBase(ctx) {
    constructor({ cacheBase }) {
      super({ cacheBase });
    }

    async get(key, options) {
      const keyHash = this.__getKeyHash(key);
      const layered = this.__getLayered(options);
      return await layered.get(keyHash, key, options);
    }

    __getLayered(options) {
      let mode = options && options.mode;
      mode = mode || this._cacheBase.mode || 'all';
      if (mode === 'all' || mode === 'mem') {
        return this.localMem;
      }
      return this.localRedis;
    }

    __getKeyHash(key) {
      if (!key) throw new Error('key is required');
      if (Array.isArray(key) || typeof key === 'object') {
        key = objectHash(key);
      } else if (typeof key !== 'string') {
        key = String(key);
      }
      return key;
    }
  }

  return LocalCache;
};
