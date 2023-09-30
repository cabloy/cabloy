module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CacheBase {
    constructor({ cacheBase }) {
      this._cacheBase = cacheBase;
      this._configModule = null;
      this._localMem = null;
      this._localRedis = null;
      this._localFetch = null;
    }

    get configModule() {
      if (!this._configModule) {
        this._configModule = ctx.config.module(moduleInfo.relativeName);
      }
      return this._configModule;
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

    __getOptionsMode(options) {
      const mode = options && options.mode;
      return mode || this._cacheBase.mode || 'all';
    }

    __checkValueEmpty(value, options) {
      let ignoreNull;
      if (options?.ignoreNull !== undefined) {
        ignoreNull = options?.ignoreNull;
      } else {
        ignoreNull = this._cacheBase.ignoreNull;
      }
      if (ignoreNull) {
        return value === undefined || value === null;
      }
      return value === undefined;
    }
  }

  return CacheBase;
};
