// validation
const ValidationFn = require('./adapter/validation.js');
const VALIDATION = Symbol('CTX#__VALIDATION');

module.exports = (options, app) => {
  return async function validation(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'validation', {
      get() {
        if (ctx.meta[VALIDATION] === undefined) {
          ctx.meta[VALIDATION] = new (ValidationFn(ctx))();
        }
        return ctx.meta[VALIDATION];
      },
    });
    // next
    await next();
  };
};
