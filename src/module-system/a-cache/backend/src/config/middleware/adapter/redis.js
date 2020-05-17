const Fn = module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class RedisDb {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's cache
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    _getKey(name) {
      return `${ctx.instance ? ctx.instance.id : 0}:${this.moduleName}:${name}`;
    }

    async get(name) {
      const redis = ctx.app.redis.get('cache');
      const key = this._getKey(name);
      const value = await redis.get(key);
      return value ? JSON.parse(value) : undefined;
    }

    async set(name, value, timeout) {
      const redis = ctx.app.redis.get('cache');
      const key = this._getKey(name);
      if (timeout) {
        await redis.set(key, JSON.stringify(value), 'PX', timeout);
      } else {
        await redis.set(key, JSON.stringify(value));
      }
    }

    async getset(name, value, timeout) {
      const redis = ctx.app.redis.get('cache');
      const key = this._getKey(name);
      let valuePrev;
      if (timeout) {
        const res = await redis.multi()
          .get(key)
          .set(key, JSON.stringify(value), 'PX', timeout)
          .exec();
        valuePrev = res[0][1];
      } else {
        const res = await redis.multi()
          .get(key)
          .set(key, JSON.stringify(value))
          .exec();
        valuePrev = res[0][1];
      }
      return valuePrev ? JSON.parse(valuePrev) : undefined;
    }

    async has(name) {
      const redis = ctx.app.redis.get('cache');
      const key = this._getKey(name);
      return await redis.exists(key) > 0;
    }

    async remove(name) {
      const redis = ctx.app.redis.get('cache');
      const key = this._getKey(name);
      await redis.del(key);
    }

  }

  return RedisDb;
};
