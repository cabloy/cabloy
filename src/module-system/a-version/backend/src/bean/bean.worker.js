const moduleInfo = module.info;
module.exports = class Worker {
  constructor(ctx) {
    super(ctx);
    this._redisCache = null;
    // this._redisIO = null;
  }

  get id() {
    return this.app.meta.workerId;
  }

  get redisCache() {
    if (!this._redisCache) this._redisCache = this.app.redis.get('cache');
    return this._redisCache;
  }

  // get redisIO() {
  //   if (!this._redisIO) this._redisIO = this.app.redis.get('io');
  //   return this._redisIO;
  // }

  async setAlive() {
    const config = this.app.meta.configs[moduleInfo.relativeName];
    const aliveTimeout = config.worker.alive.timeout;
    const key = `workerAlive:${this.id}`;
    await this.redisCache.set(key, JSON.stringify(true), 'PX', aliveTimeout * 2);
    // await this.redisIO.set(key, JSON.stringify(true), 'PX', aliveTimeout * 2);
  }

  async getAlive({ id }) {
    const key = `workerAlive:${id}`;
    const value = await this.redisCache.get(key);
    return value ? JSON.parse(value) : undefined;
  }
};
