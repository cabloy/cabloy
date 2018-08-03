const SequenceFn = require('./adapter/sequence.js');
const SEQUENCE = Symbol('CTX#__SEQUENCE');

module.exports = () => {
  return async function sequence(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'sequence', {
      get() {
        if (ctx.meta[SEQUENCE] === undefined) {
          ctx.meta[SEQUENCE] = new (SequenceFn(ctx))();
        }
        return ctx.meta[SEQUENCE];
      },
    });

    // next
    await next();
  };
};
