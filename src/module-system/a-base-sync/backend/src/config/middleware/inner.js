module.exports = ctx => {
  class Middleware {
    async execute(options, next) {
      if (!ctx.innerAccess) ctx.throw(403);
      // next
      await next();
    }
  }
  return Middleware;
};
