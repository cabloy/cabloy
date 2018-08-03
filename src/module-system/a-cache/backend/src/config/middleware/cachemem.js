const memFn = require('./adapter/mem.js');
const CACHE = Symbol('CTX#__CACHE');

module.exports = () => {
  return async function cachemem(ctx, next) {
    ctx.cache = ctx.cache || {};
    Object.defineProperty(ctx.cache, 'mem', {
      get() {
        if (ctx.cache[CACHE] === undefined) {
          ctx.cache[CACHE] = new (memFn(ctx))();
        }
        return ctx.cache[CACHE];
      },
    });

    // next
    await next();
  };
};
