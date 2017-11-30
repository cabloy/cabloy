module.exports = options => {
  return async function safeAccess(ctx, next) {
    if (!options.whitelist[ctx.ip]) ctx.throw(403);
    // next
    await next();
  };
};
