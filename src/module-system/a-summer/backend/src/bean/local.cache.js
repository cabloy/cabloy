const require3 = require('require3');
const objectHash = require3('object-hash');
const CacheBase = require('../common/cacheBase.js');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class LocalCache extends CacheBase(ctx) {
    constructor({ cacheBase }) {
      super({ cacheBase });
    }

    async get(key) {
      const keyHash = this.__getKeyHash(key);
      return await this.layered.get(keyHash);
    }

    get layered() {
      if (!this._layered) {
        const mode = this._cacheBase.mode || 'all';
        if (mode === 'all' || mode === 'mem') {
          this._layered = this.localMem;
        } else {
          this._layered = this.localRedis;
        }
      }
      return this._layered;
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
