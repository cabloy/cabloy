module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function jsonp(ctx, next) {
    // options
    options = options || {};
    // whiteList
    if (ctx.app.meta.isTest) {
      options.whiteList = false;
    } else {
      const _config = ctx.config.module(moduleInfo.relativeName);
      const _whiteList = _config && _config.jsonp && _config.jsonp.whiteList;
      const hostSelf = ctx.host.split(':')[0];
      if (_whiteList) {
        if (!Array.isArray(_whiteList)) {
          options.whiteList = _whiteList.split(',');
        } else {
          options.whiteList = _whiteList.concat();
        }
        options.whiteList.push(hostSelf);
      } else {
        options.whiteList = [ hostSelf ];
      }
    }
    // jsonp
    const fn = ctx.app.jsonp(options);
    await fn(ctx, next);
  };
};
