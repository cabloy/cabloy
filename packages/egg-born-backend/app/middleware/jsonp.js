module.exports = options => {
  return async function jsonp(ctx, next) {
    options = options || {};
    options.whiteList = ctx.instance.meta && ctx.instance.meta.jsonp && ctx.instance.meta.jsonp.whiteList;
    const fn = ctx.app.jsonp(options);
    await fn(ctx, next);
  };
};
