const CacheBase = require('../common/cacheBase.js');

module.exports = ctx => {
  class LocalFetch extends CacheBase(ctx) {
    constructor({ cacheBase }) {
      super({ cacheBase });
      this._cacheBean = null;
    }

    async get(keyHash, key, options) {
      const fn_get = options?.fn_get;
      if (fn_get) {
        return await fn_get(key, options, keyHash);
      }
      return await this.cacheBean.get(key, options, keyHash);
    }

    async mget(keysHash, keys, options) {
      // mget
      const fn_mget = options?.fn_mget;
      if (fn_mget) {
        return await fn_mget(keys, options, keysHash);
      }
      if (this.cacheBean && this.cacheBean.mget) {
        return await this.cacheBean.mget(keys, options, keysHash);
      }
      // fallback
      const values = [];
      for (let i = 0; i < keys.length; i++) {
        values.push(await this.get(keysHash[i], keys[i], options));
      }
      return values;
    }

    async peek(/* keyHash, key, options*/) {
      // just return undefined
      return undefined;
    }

    async del(/* keyHash , key, options*/) {
      // do nothing
    }

    async mdel(/* keysHash, keys, options*/) {
      // do nothing
    }

    async clear(/* options*/) {
      // do nothing
    }

    get cacheBean() {
      if (!this._cacheBase.beanFullName) return null;
      if (!this._cacheBean) {
        this._cacheBean = ctx.bean._newBean(this._cacheBase.beanFullName, {
          cacheBase: this._cacheBase,
        });
      }
      return this._cacheBean;
    }
  }

  return LocalFetch;
};
