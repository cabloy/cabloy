module.exports = ctx => {
  class Middleware {
    async execute(options, next) {
      // check appReady
      if (!ctx.innerAccess) {
        await ctx.bean.instance.checkAppReady();
      }
      // next
      await next();
    }
  }
  return Middleware;
};
