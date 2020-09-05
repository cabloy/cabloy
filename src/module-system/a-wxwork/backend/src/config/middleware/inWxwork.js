module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function inWxwork(ctx, next) {
    if (!ctx.bean.wxwork.util.in(options.scene)) return ctx.throw.module(moduleInfo.relativeName, 1001);
    // next
    await next();
  };
};
