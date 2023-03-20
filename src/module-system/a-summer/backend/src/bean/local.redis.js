module.exports = ctx => {
  class LocalRedis {
    constructor() {
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
