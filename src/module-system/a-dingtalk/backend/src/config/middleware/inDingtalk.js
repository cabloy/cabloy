const DingtalkHelperFn = require('../../common/dingtalkHelper.js');

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function inWxwork(ctx, next) {
    const dingtalkHelper = new (DingtalkHelperFn(ctx))();
    const api = dingtalkHelper.createDingtalkApi();
    if (!api.util.in(options.scene)) return ctx.throw.module(moduleInfo.relativeName, 1001);
    // next
    await next();
  };
};
