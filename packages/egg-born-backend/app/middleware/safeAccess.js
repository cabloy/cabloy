module.exports = () => {
  return async function safeAccess(ctx, next) {
    if (!ctx.safeAccess) ctx.throw(403);
    // next
    await next();
  };
};
