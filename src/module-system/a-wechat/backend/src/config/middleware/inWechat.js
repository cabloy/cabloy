module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function inWechat(ctx, next) {
    const provider = ctx.user && ctx.user.provider;
    const ok = (provider && provider.module === moduleInfo.relativeName && provider.providerName === 'wechat');
    if (!ok) ctx.throw.module(moduleInfo.relativeName, 1001);
    // next
    await next();
  };
};
