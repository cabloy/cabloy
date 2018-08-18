const FileFn = require('./adapter/file.js');
const FILE = Symbol('CTX#__FILE');

module.exports = () => {
  return async function file(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'file', {
      get() {
        if (ctx.meta[FILE] === undefined) {
          ctx.meta[FILE] = new (FileFn(ctx))();
        }
        return ctx.meta[FILE];
      },
    });

    // next
    await next();
  };
};
