module.exports = () => {
  return async function disableVersionCheck(ctx, next) {
    // only access from localhost
    if (ctx.ip !== '127.0.0.1') ctx.throw(403);
    // next
    await next();
  };
};
