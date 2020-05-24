// mail
const MailFn = require('./adapter/mail.js');
const MAIL = Symbol('CTX#__MAIL');

module.exports = () => {
  return async function mail(ctx, next) {
    ctx.meta = ctx.meta || {};
    // mail
    Object.defineProperty(ctx.meta, 'mail', {
      get() {
        if (ctx.meta[MAIL] === undefined) {
          ctx.meta[MAIL] = new (MailFn(ctx))();
        }
        return ctx.meta[MAIL];
      },
    });
    // next
    await next();
  };
};
