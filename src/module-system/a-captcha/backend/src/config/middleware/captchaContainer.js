// captchaContainer
const CaptchaContainerFn = require('./adapter/captchaContainer.js');
const CaptchaController = Symbol('CTX#__CaptchaController');


module.exports = () => {
  return async function captchaContainer(ctx, next) {
    ctx.meta = ctx.meta || {};
    // captchaContainer
    Object.defineProperty(ctx.meta, 'captcha', {
      get() {
        if (ctx.meta[CaptchaController] === undefined) {
          ctx.meta[CaptchaController] = new (CaptchaContainerFn(ctx))();
        }
        return ctx.meta[CaptchaController];
      },
    });
    // next
    await next();
  };
};
