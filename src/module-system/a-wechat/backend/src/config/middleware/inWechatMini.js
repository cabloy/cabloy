module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function inWechatMini(ctx, next) {
    const provider = ctx.user && ctx.user.provider;
    const ok = (provider && provider.module === moduleInfo.relativeName && provider.providerName === 'wechatmini');
    if (!ok) ctx.throw.module(moduleInfo.relativeName, 1002);
    // next
    await next();
  };
};
