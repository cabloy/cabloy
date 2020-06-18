const WechatHelperFn = require('../../common/wechatHelper.js');
const WECHAT = Symbol('CTX#WECHAT');

module.exports = (options, app) => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function wechat(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'wechat', {
      get() {
        if (ctx.meta[WECHAT] === undefined) {
          const wechatHelper = new (WechatHelperFn(ctx))();
          ctx.meta[WECHAT] = wechatHelper.createWechatApi();
        }
        return ctx.meta[WECHAT];
      },
    });

    // next
    await next();
  };

};

