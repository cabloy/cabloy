const WxworkHelperFn = require('../../common/wxworkHelper.js');

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function inWxwork(ctx, next) {
    const wxworkHelper = new (WxworkHelperFn(ctx))();
    const api = wxworkHelper.createWxworkApi();
    if (!api.util.in(options.scene)) return ctx.throw.module(moduleInfo.relativeName, 1001);
    // next
    await next();
  };
};
