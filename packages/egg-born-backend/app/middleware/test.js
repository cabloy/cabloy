module.exports = () => {
  return async function test(ctx, next) {
    if (!ctx.app.meta.isTest) ctx.throw(403);
    // next
    await next();
  };
};
