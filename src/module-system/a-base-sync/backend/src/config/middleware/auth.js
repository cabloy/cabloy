module.exports = (options, app) => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function auth(ctx, next) {
    // check
    await ctx.bean.user.check(options);
    // next
    await next();
  };
};
