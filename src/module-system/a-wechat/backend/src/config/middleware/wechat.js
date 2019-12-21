const require3 = require('require3');
const WechatAPI = require3('co-wechat-api');
const WECHAT = Symbol('CTX#WECHAT');

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  function _createWechatApi({ ctx }) {
    const cacheKey = 'wechat-token';
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.public;
    // api
    return new WechatAPI(config.appID, config.appSecret,
      async function() {
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(token) {
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
      });
  }

  return async function event(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'wechat', {
      get() {
        if (ctx.meta[WECHAT] === undefined) {
          ctx.meta[WECHAT] = _createWechatApi({ ctx });
        }
        return ctx.meta[WECHAT];
      },
    });

    // next
    await next();
  };

};

