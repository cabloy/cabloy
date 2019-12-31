const require3 = require('require3');
const WechatAPI = require3('@zhennann/co-wechat-api');
const WECHATMINI = Symbol('CTX#WECHATMINI');

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  function _createWechatMiniApi({ ctx }) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.mini;
    // api
    const api = new WechatAPI(config.appID, config.appSecret,
      async function() {
        const cacheKey = 'wechatmini-token';
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(token) {
        const cacheKey = 'wechatmini-token';
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
      }
    );
    // registerTicketHandle
    api.registerTicketHandle(
      async function(type) {
        const cacheKey = `wechatmini-jsticket:${type}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(type, token) {
        const cacheKey = `wechatmini-jsticket:${type}`;
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
      }
    );
    // registerSessionKeyHandle
    api.registerSessionKeyHandle(
      async function() {
        const cacheKey = `wechatmini-sessionKey:${ctx.user.agent.id}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(sessionKey) {
        const cacheKey = `wechatmini-sessionKey:${ctx.user.agent.id}`;
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, sessionKey);
      }
    );
    // ready
    return api;
  }

  return async function event(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'wechatMini', {
      get() {
        if (ctx.meta[WECHATMINI] === undefined) {
          ctx.meta[WECHATMINI] = _createWechatMiniApi({ ctx });
        }
        return ctx.meta[WECHATMINI];
      },
    });

    // next
    await next();
  };

};

