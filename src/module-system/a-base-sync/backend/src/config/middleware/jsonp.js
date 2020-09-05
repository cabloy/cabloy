module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Middleware {
    async execute(options, next) {
      // options
      options = options || {};
      // whiteList
      if (ctx.app.meta.isTest) {
        options.whiteList = false;
      } else {
        const _config = ctx.config.module(moduleInfo.relativeName);
        const _whiteList = _config && _config.jsonp && _config.jsonp.whiteList;
        const hostSelf = ctx.hostname;
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
    }
  }
  return Middleware;
};
