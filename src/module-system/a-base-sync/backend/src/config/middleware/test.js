module.exports = ctx => {
  class Middleware {
    async execute(options, next) {
      if (!ctx.app.meta.isTest) ctx.throw(403);
      // next
      await next();
    }
  }
  return Middleware;
};
