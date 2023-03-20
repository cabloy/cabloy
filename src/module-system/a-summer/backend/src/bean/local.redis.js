const CacheBase = require('../common/cacheBase.js');

module.exports = ctx => {
  class LocalRedis extends CacheBase(ctx) {
    constructor({ cacheBase }) {
      super({ cacheBase });
      this._redisSummer = null;
    }

    get redisSummer() {
      if (!this._redisSummer) {
        this._redisSummer = ctx.app.redis.get('summer');
      }
      return this._redisSummer;
    }
  }

  return LocalRedis;
};
