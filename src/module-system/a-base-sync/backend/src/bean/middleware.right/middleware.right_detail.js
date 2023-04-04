module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Middleware {
    async checkDetail(moduleInfo, options, ctx) {
      await ctx.bean.detail._checkRightForMiddleware({ options });
    }
  }

  return Middleware;
};
