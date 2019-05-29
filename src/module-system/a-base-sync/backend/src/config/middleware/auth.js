module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function auth(ctx, next) {
    // always has anonymous id
    ctx.meta.user.anonymousId();
    // check
    if (!ctx.isAuthenticated() || !ctx.user.op || !ctx.user.agent || ctx.user.op.iid !== ctx.instance.id) {
      // anonymous
      await ctx.meta.user.loginAsAnonymous();
    } else {
      // check if deleted,disabled,agent
      await ctx.meta.user.check();
    }

    // if user
    if (options.user && ctx.user.op.anonymous) ctx.throw(401);

    // next
    await next();
  };
};
