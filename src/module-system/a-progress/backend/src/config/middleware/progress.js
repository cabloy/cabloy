// progress
const ProgressFn = require('./adapter/progress.js');
const PROGRESS = Symbol('CTX#__PROGRESS');

module.exports = () => {
  return async function progress(ctx, next) {
    ctx.meta = ctx.meta || {};
    // progress
    Object.defineProperty(ctx.meta, 'progress', {
      get() {
        if (ctx.meta[PROGRESS] === undefined) {
          ctx.meta[PROGRESS] = new (ProgressFn(ctx))();
        }
        return ctx.meta[PROGRESS];
      },
    });

    // next
    await next();
  };
};
