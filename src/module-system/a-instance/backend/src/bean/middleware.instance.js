module.exports = ctx => {
  // const moduleInfo = module.info;
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
