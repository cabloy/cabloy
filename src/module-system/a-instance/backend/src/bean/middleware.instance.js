module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Middleware {
    async execute(options, next) {
      // init instance
      await ctx.bean.instance.initInstance();
      // next
      await next();
    }
  }
  return Middleware;
};
