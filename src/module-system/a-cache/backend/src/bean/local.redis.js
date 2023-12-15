// const moduleInfo = module.info;
module.exports = class RedisDb extends module.meta.class.BeanModuleBase {
  _getKey(name) {
    return `${this.ctx.instance ? this.ctx.instance.id : 0}:${this.moduleName}:${name}`;
  }

  async get(name) {
    const redis = this.ctx.app.redis.get('cache');
    const key = this._getKey(name);
    const value = await redis.get(key);
    return value ? JSON.parse(value) : undefined;
  }

  async set(name, value, timeout) {
    const redis = this.ctx.app.redis.get('cache');
    const key = this._getKey(name);
    if (timeout) {
      await redis.set(key, JSON.stringify(value), 'PX', timeout);
    } else {
      await redis.set(key, JSON.stringify(value));
    }
  }

  async getset(name, value, timeout) {
    const redis = this.ctx.app.redis.get('cache');
    const key = this._getKey(name);
    let valuePrev;
    if (timeout) {
      const res = await redis.multi().get(key).set(key, JSON.stringify(value), 'PX', timeout).exec();
      valuePrev = res[0][1];
    } else {
      const res = await redis.multi().get(key).set(key, JSON.stringify(value)).exec();
      valuePrev = res[0][1];
    }
    return valuePrev ? JSON.parse(valuePrev) : undefined;
  }

  async has(name) {
    const redis = this.ctx.app.redis.get('cache');
    const key = this._getKey(name);
    return (await redis.exists(key)) > 0;
  }

  async remove(name) {
    const redis = this.ctx.app.redis.get('cache');
    const key = this._getKey(name);
    await redis.del(key);
  }
};
