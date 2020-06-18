const WechatHelperFn = require('../../common/wechatHelper.js');

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function inWechat(ctx, next) {
    const wechatHelper = new (WechatHelperFn(ctx))();
    const api = wechatHelper.createWechatApi();
    if (!api.util.in(options.scene)) return ctx.throw.module(moduleInfo.relativeName, 1001);
    // next
    await next();
  };
};
