module.exports = options => {
  return async function jsonp(ctx, next) {
    const fn = ctx.app.jsonp(options);
    await fn(ctx, next);
  };
};
