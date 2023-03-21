const CacheBase = require('../common/cacheBase.js');

module.exports = ctx => {
  class LocalRedis extends CacheBase(ctx) {
    constructor({ cacheBase }) {
      super({ cacheBase });
      this._redisSummer = null;
    }

    async get(keyHash, key, options) {
      const redisKey = this._getRedisKey(keyHash);
      let value = await this.redisSummer.get(redisKey);
      value = value ? JSON.parse(value) : undefined;
      if (value === undefined) {
        const layered = this.__getLayered(options);
        value = await layered.get(keyHash, key, options);
        await this.redisSummer.set(redisKey, JSON.stringify(value), 'PX', this._cacheBase.redis.ttl);
      }
      return value;
    }

    async peek(keyHash, key, options) {
      const redisKey = this._getRedisKey(keyHash);
      let value = await this.redisSummer.get(redisKey);
      value = value ? JSON.parse(value) : undefined;
      if (value === undefined) {
        const layered = this.__getLayered(options);
        value = await layered.peek(keyHash, key, options);
      }
      return value;
    }

    __getLayered(/* options*/) {
      return this.localFetch;
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
