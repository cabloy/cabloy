const require3 = require('require3');
const WechatAPI = require3('@zhennann/co-wechat-api');

module.exports = function(ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  return function() {
    return new Proxy({}, {
      get(obj, prop) {
        if (obj[prop]) return obj[prop];
        if (prop === 'app') {
          // app
          obj[prop] = _createWechatApiApp();
        } else if (prop === 'mini') {
          // mini
          obj[prop] = new Proxy({}, {
            get(obj, prop) {
              if (!obj[prop]) {
                obj[prop] = _createWechatApiMini({ sceneShort: prop });
              }
              return obj[prop];
            },
          });
        } else if (prop === 'util') {
          // util
          obj[prop] = _createWechatApiUtil();
        }
        return obj[prop];
      },
    });
  };

  function _createWechatApiApp() {
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
        if (token) {
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
        } else {
          await ctx.cache.db.module(moduleInfo.relativeName).remove(cacheKey);
        }
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
        if (token) {
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
        } else {
          await ctx.cache.db.module(moduleInfo.relativeName).remove(cacheKey);
        }
      }
    );
    // ready
    return api;
  }

  function _createWechatApiMini({ sceneShort }) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.minis[sceneShort];
    // api
    const api = new WechatAPI(config.appID, config.appSecret,
      async function() {
        const cacheKey = 'wechatmini-token';
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(token) {
        const cacheKey = 'wechatmini-token';
        if (token) {
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
        } else {
          await ctx.cache.db.module(moduleInfo.relativeName).remove(cacheKey);
        }
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
        if (token) {
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
        } else {
          await ctx.cache.db.module(moduleInfo.relativeName).remove(cacheKey);
        }
      }
    );
    // registerSessionKeyHandle
    api.registerSessionKeyHandle(
      async function() {
        const cacheKey = `wechatmini-sessionKey:${ctx.state.user.agent.id}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(sessionKey) {
        const cacheKey = `wechatmini-sessionKey:${ctx.state.user.agent.id}`;
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, sessionKey);
      }
    );
    // ready
    return api;
  }

  function _createWechatApiUtil() {
    return {
      // scene: empty/wechat/wechatweb/wechatmini/xxx,xxx,xxx
      in(scene) {
        // scene
        if (!scene) scene = 'wechat';
        if (typeof scene === 'string') scene = scene.split(',');
        // provider
        const provider = ctx.state.user && ctx.state.user.provider;
        if (!provider || provider.module !== moduleInfo.relativeName) return false;
        // find any match
        for (const item of scene) {
          const ok = (provider.providerName === item) || (item === 'wechatmini' && provider.providerName.indexOf(item) > -1);
          if (ok) return true;
        }
        // not found
        return false;
      },
    };
  }

};
