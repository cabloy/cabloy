const dbFn = require('./adapter/db.js');
const redisFn = require('./adapter/redis.js');
const CACHE = Symbol('CTX#__CACHE');

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function cachedb(ctx, next) {
    ctx.cache = ctx.cache || {};
    Object.defineProperty(ctx.cache, 'db', {
      get() {
        if (ctx.cache[CACHE] === undefined) {
          const config = ctx.config.module(moduleInfo.relativeName);
          if (config.db.redis) {
            ctx.cache[CACHE] = new (redisFn(ctx))();
          } else {
            ctx.cache[CACHE] = new (dbFn(ctx))();
          }
        }
        return ctx.cache[CACHE];
      },
    });

    // next
    await next();
  };
};
