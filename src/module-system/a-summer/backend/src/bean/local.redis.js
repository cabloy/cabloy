const CacheBase = require('../common/cacheBase.js');

module.exports = ctx => {
  class LocalRedis extends CacheBase(ctx) {
    constructor({ cacheBase }) {
      super({ cacheBase });
      this._redisSummer = null;
    }

    async get(keyHash) {
      const redisKey = this._getRedisKey(keyHash);
      let value = await this.redisSummer.get(redisKey);
      value = value ? JSON.parse(value) : undefined;
      if (value === undefined) {
        value = await this.layered.get(keyHash);
        await this.redisSummer.set(redisKey, JSON.stringify(value), 'PX', this._cacheBase.redis.ttl);
      }
      return value;
    }

    get layered() {
      if (!this._layered) {
        this._layered = this.localFetch;
      }
      return this._layered;
    }

    get redisSummer() {
      if (!this._redisSummer) {
        this._redisSummer = ctx.app.redis.get('summer');
      }
      return this._redisSummer;
    }

    _getRedisKey(key) {
      return `${this._cacheBase.fullKey}!${key}`;
    }
  }

  return LocalRedis;
};
