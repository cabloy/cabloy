module.exports = () => {
  return async function inner(ctx, next) {
    if (!ctx.innerAccess) ctx.throw(403);
    // next
    await next();
  };
};
