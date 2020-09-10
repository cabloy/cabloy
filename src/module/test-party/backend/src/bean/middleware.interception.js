module.exports = ctx => {
  class Middleware {
    async execute(options, next) {
      const { a, b } = ctx.request.body;
      if (a === undefined || b === undefined) return ctx.throw(1002); // 1002: 'Incomplete Parameters'
      // next
      await next();
    }
  }
  return Middleware;
};
