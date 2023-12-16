const moduleInfo = module.info;

module.exports = class Cache {
  get db() {
    const config = this.ctx.config.module(moduleInfo.relativeName);
    if (config.db.redis) {
      return this.redis;
    }
    return this._db;
  }

  get _db() {
    return this.ctx.bean._getBean(moduleInfo, 'local.db');
  }

  get mem() {
    return this.ctx.bean._getBean(moduleInfo, 'local.mem');
  }

  get redis() {
    return this.ctx.bean._getBean(moduleInfo, 'local.redis');
  }
};
