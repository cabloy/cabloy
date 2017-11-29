module.exports = () => {
  return async function auth(ctx, next) {
    if (!ctx.isAuthenticated()) ctx.throw(401);
    // next
    await next();
  };
};
