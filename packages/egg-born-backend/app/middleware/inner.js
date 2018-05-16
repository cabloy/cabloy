module.exports = () => {
  return async function inner(ctx, next) {
    if (!ctx.innerAccess && ctx.headers['x-inner-cookie'] !== ctx.app.meta.__innerCookie) ctx.throw(403);
    // next
    await next();
  };
};
