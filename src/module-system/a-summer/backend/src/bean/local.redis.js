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

    async mget(keysHash, keys, options) {
      // peek
      let values = await this.redisSummer.mget(keysHash);
      values = values.map(v => (v ? JSON.parse(v) : undefined));
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
        // set/merge
        const multi = this.redisSummer.multi();
        for (let i = 0; i < keysHashMissing.length; i++) {
          const valueMissing = valuesMissing[i];
          multi.setex(keysHashMissing[i], Math.trunc(this._cacheBase.redis.ttl / 1000), JSON.stringify(valueMissing));
          values[indexesMissing[i]] = valueMissing;
        }
        await multi.exec();
      }
      // ok
      return values;
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
