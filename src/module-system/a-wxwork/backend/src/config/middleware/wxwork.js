const require3 = require('require3');
const WxworkAPI = require3('@zhennann/co-wxwork-api');
const WXWORK = Symbol('CTX#WXWORK');

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  function _createWxworkApiApp({ ctx, appName }) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.wxwork;
    // api
    const api = new WxworkAPI.CorpAPI(config.corpid, config.apps[appName].secret, appName,
      async function(appName) {
        const cacheKey = `wxwork-token:${appName || ''}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(token, appName) {
        const cacheKey = `wxwork-token:${appName || ''}`;
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
      }
    );
    // registerTicketHandle
    api.registerTicketHandle(
      async function(type) {
        const cacheKey = `wxwork-jsticket:${type}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(type, token) {
        const cacheKey = `wxwork-jsticket:${type}`;
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
      }
    );
    // ready
    return api;
  }
  function _createWxworkApi({ ctx }) {
    const api = { };
    api.app = new Proxy({}, {
      get(obj, prop) {
        if (!obj[prop]) {
          obj[prop] = _createWxworkApiApp({ ctx, appName: prop });
        }
        return obj[prop];
      },
    });
  }

  return async function wxwork(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'wxwork', {
      get() {
        if (ctx.meta[WXWORK] === undefined) {
          ctx.meta[WXWORK] = _createWxworkApi({ ctx });
        }
        return ctx.meta[WXWORK];
      },
    });

    // next
    await next();
  };

};

