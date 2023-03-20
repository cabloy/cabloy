const CacheBase = require('../common/cacheBase.js');

module.exports = ctx => {
  class LocalMem extends CacheBase(ctx) {
    constructor({ cacheBase }) {
      super({ cacheBase });
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
  }

  return LocalMem;
};
