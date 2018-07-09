module.exports = options => {
  return async function auth(ctx, next) {
    if (!ctx.isAuthenticated() || !ctx.user.op || !ctx.user.agent) {
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
