const dbFn = require('./adapter/db.js');
const CACHE = Symbol('CTX#__CACHE');

module.exports = () => {
  return async function cachedb(ctx, next) {
    ctx.cache = ctx.cache || {};
    Object.defineProperty(ctx.cache, 'db', {
      get() {
        if (ctx.cache[CACHE] === undefined) {
          ctx.cache[CACHE] = new (dbFn(ctx))();
        }
        return ctx.cache[CACHE];
      },
    });

    // next
    await next();
  };
};
