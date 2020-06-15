const WxworkHelperFn = require('../../common/wxworkHelper.js');
const WXWORK = Symbol('CTX#WXWORK');

module.exports = (options, app) => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function wxwork(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'wxwork', {
      get() {
        if (ctx.meta[WXWORK] === undefined) {
          const wxworkHelper = new (WxworkHelperFn(ctx))();
          ctx.meta[WXWORK] = wxworkHelper.createWxworkApi();
        }
        return ctx.meta[WXWORK];
      },
    });

    // next
    await next();
  };

};

