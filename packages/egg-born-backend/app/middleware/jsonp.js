module.exports = options => {
  return async function jsonp(ctx, next) {
    options = options || {};
    options.whiteList = ctx.instance.meta && ctx.instance.meta.jsonp && ctx.instance.meta.jsonp.whiteList;
    const hostSelf = ctx.host.split(':')[0];
    if (options.whiteList) {
      if (!Array.isArray(options.whiteList)) {
        options.whiteList = [ options.whiteList ];
      }
      options.whiteList.push(hostSelf);
    } else {
      options.whiteList = [ hostSelf ];
    }
    const fn = ctx.app.jsonp(options);
    await fn(ctx, next);
  };
};
