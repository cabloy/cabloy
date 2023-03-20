const CacheBase = require('../common/cacheBase.js');

module.exports = ctx => {
  class LocalFetch extends CacheBase(ctx) {
    constructor({ cacheBase }) {
      super({ cacheBase });
      this._cacheBean = null;
    }

    async get(keyHash, key) {
      return await this.cacheBean.get(key, keyHash);
    }

    get cacheBean() {
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
