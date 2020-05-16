const dbFn = require('./adapter/db.js');
const redisFn = require('./adapter/redis.js');
const CACHE = Symbol('CTX#__CACHE');
const CACHEDB = Symbol('CTX#__CACHEDB');

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
    Object.defineProperty(ctx.cache, '_db', {
      get() {
        if (ctx.cache[CACHEDB] === undefined) {
          ctx.cache[CACHEDB] = new (dbFn(ctx))();
        }
        return ctx.cache[CACHEDB];
      },
    });

    // next
    await next();
  };
};
