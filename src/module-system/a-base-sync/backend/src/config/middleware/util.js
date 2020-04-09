// util
const UtilFn = require('./adapter/util.js');
const UTIL = Symbol('CTX#__UTIL');

module.exports = () => {
  return async function util(ctx, next) {
    ctx.meta = ctx.meta || {};

    // util
    Object.defineProperty(ctx.meta, 'util', {
      get() {
        if (ctx.meta[UTIL] === undefined) {
          ctx.meta[UTIL] = new (UtilFn(ctx))();
        }
        return ctx.meta[UTIL];
      },
    });

    // next
    await next();
  };
};
