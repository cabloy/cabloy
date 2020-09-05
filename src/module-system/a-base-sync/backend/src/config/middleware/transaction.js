module.exports = ctx => {
  class Middleware {
    async execute(options, next) {
      await ctx.dbMeta.transaction.begin(async () => {
        // next
        await next();
        checkIfSuccess(ctx);
      });
    }
  }
  return Middleware;
};

function checkIfSuccess(ctx) {
  if (typeof ctx.response.body === 'object' && ctx.response.body && ctx.response.body.code !== undefined) {
    if (ctx.response.body.code !== 0) {
      throw ctx.app.meta.util.createError(ctx.response.body);
    }
  } else {
    if (ctx.response.status !== 200) {
      ctx.throw(ctx.response.status);
    }
  }
}
