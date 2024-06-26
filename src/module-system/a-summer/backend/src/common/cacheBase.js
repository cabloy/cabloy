const moduleInfo = module.info;
module.exports = class CacheBase {
  constructor({ cacheBase }) {
    this._cacheBase = cacheBase;
    this._configModule = null;
    this._localMem = null;
    this._localRedis = null;
    this._localFetch = null;
  }

  get configModule() {
    if (!this._configModule) {
      this._configModule = this.ctx.config.module(moduleInfo.relativeName);
    }
    return this._configModule;
  }

  get localMem() {
    if (!this._localMem) {
      this._localMem = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.mem`, {
        cacheBase: this._cacheBase,
      });
    }
    return this._localMem;
  }

  get localRedis() {
    if (!this._localRedis) {
      this._localRedis = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.redis`, {
        cacheBase: this._cacheBase,
      });
    }
    return this._localRedis;
  }

  get localFetch() {
    if (!this._localFetch) {
      this._localFetch = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.fetch`, {
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
};
