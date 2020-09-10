module.exports = ctx => {
  class Middleware {
    async execute(options, next) {
      // check
      await ctx.bean.user.check(options);
      // next
      await next();
    }
  }
  return Middleware;
};
