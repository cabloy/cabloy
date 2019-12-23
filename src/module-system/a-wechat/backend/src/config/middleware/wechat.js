const require3 = require('require3');
const WechatAPI = require3('co-wechat-api');
const WECHAT = Symbol('CTX#WECHAT');

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  function _createWechatApi({ ctx }) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.public;
    // api
    const api = new WechatAPI(config.appID, config.appSecret,
      async function() {
        const cacheKey = 'wechat-token';
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(token) {
        const cacheKey = 'wechat-token';
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
      }
    );
    // registerTicketHandle
    api.registerTicketHandle(
      async function(type) {
        const cacheKey = `wechat-jsticket:${type}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(type, token) {
        const cacheKey = `wechat-jsticket:${type}`;
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
      }
    );
    // ready
    return api;
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

