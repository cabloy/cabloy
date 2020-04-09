const redisFn = require('./adapter/redis.js');
const CACHE = Symbol('CTX#__CACHE');

module.exports = () => {
  return async function cachedb(ctx, next) {
    ctx.cache = ctx.cache || {};
    Object.defineProperty(ctx.cache, 'redis', {
      get() {
        if (ctx.cache[CACHE] === undefined) {
          ctx.cache[CACHE] = new (redisFn(ctx))();
        }
        return ctx.cache[CACHE];
      },
    });

    // next
    await next();
  };
};
