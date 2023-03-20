module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CacheBase {
    constructor({ cacheBase }) {
      this._cacheBase = cacheBase;
      this._layered = null;
      this._localMem = null;
      this._localRedis = null;
      this._localFetch = null;
    }

    get localMem() {
      if (!this._localMem) {
        this._localMem = ctx.bean._newBean(`${moduleInfo.relativeName}.local.mem`, {
          cacheBase: this._cacheBase,
        });
      }
      return this._localMem;
    }

    get localRedis() {
      if (!this._localRedis) {
        this._localRedis = ctx.bean._newBean(`${moduleInfo.relativeName}.local.redis`, {
          cacheBase: this._cacheBase,
        });
      }
      return this._localRedis;
    }

    get localFetch() {
      if (!this._localFetch) {
        this._localFetch = ctx.bean._newBean(`${moduleInfo.relativeName}.local.fetch`, {
          cacheBase: this._cacheBase,
        });
      }
      return this._localFetch;
    }
  }

  return CacheBase;
};
