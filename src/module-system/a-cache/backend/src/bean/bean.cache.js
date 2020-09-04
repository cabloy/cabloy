module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Cache {

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

  }

  return Cache;
};
