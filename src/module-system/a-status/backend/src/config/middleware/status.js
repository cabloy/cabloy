const StatusFn = require('./adapter/status.js');
const STATUS = Symbol('CTX#__STATUS');

module.exports = () => {
  return async function status(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'status', {
      get() {
        if (ctx.meta[STATUS] === undefined) {
          ctx.meta[STATUS] = new (StatusFn(ctx))();
        }
        return ctx.meta[STATUS];
      },
    });

    // next
    await next();
  };
};
