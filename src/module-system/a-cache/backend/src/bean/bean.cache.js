const moduleInfo = module.info;

module.exports = class Cache {
  get db() {
    const config = ctx.config.module(moduleInfo.relativeName);
    if (config.db.redis) {
      return this.redis;
    }
    return this._db;
  }

  get _db() {
    return ctx.bean._getBean(moduleInfo, 'local.db');
  }

  get mem() {
    return ctx.bean._getBean(moduleInfo, 'local.mem');
  }

  get redis() {
    return ctx.bean._getBean(moduleInfo, 'local.redis');
  }
};
