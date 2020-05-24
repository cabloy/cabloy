// io
const IOFn = require('./adapter/io.js');
const IO = Symbol('CTX#__IO');

module.exports = () => {
  return async function io(ctx, next) {
    ctx.meta = ctx.meta || {};
    // io
    Object.defineProperty(ctx.meta, 'io', {
      get() {
        if (ctx.meta[IO] === undefined) {
          ctx.meta[IO] = new (IOFn(ctx))();
        }
        return ctx.meta[IO];
      },
    });
    // next
    await next();
  };
};
