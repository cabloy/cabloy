const EventFn = require('./adapter/event.js');
const EVENT = Symbol('CTX#EVENT');

module.exports = () => {
  return async function event(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'event', {
      get() {
        if (ctx.meta[EVENT] === undefined) {
          ctx.meta[EVENT] = new (EventFn(ctx))();
        }
        return ctx.meta[EVENT];
      },
    });

    // next
    await next();
  };
};
