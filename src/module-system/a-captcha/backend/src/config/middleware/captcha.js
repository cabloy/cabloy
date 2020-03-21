// captcha
const CaptchaFn = require('./adapter/captcha.js');
const CAPTCHA = Symbol('CTX#__CAPTCHA');

module.exports = () => {
  return async function captcha(ctx, next) {
    ctx.meta = ctx.meta || {};
    // captchaContainer
    Object.defineProperty(ctx.meta, 'captcha', {
      get() {
        if (ctx.meta[CAPTCHA] === undefined) {
          ctx.meta[CAPTCHA] = new (CaptchaFn(ctx))();
        }
        return ctx.meta[CAPTCHA];
      },
    });
    // next
    await next();
  };
};
