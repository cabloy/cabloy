const DingtalkHelperFn = require('../../common/dingtalkHelper.js');
const DINGTALK = Symbol('CTX#DINGTALK');

module.exports = (options, app) => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function dingtalk(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'wxwork', {
      get() {
        if (ctx.meta[DINGTALK] === undefined) {
          const dingtalkHelper = new (DingtalkHelperFn(ctx))();
          ctx.meta[DINGTALK] = dingtalkHelper.createDingtalkApi();
        }
        return ctx.meta[DINGTALK];
      },
    });

    // next
    await next();
  };

};

