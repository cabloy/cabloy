const require3 = require('require3');
const WxworkAPI = require3('@zhennann/co-wxwork-api');
const WechatAPI = require3('@zhennann/co-wechat-api');
module.exports = function(ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  return function() {
    return new Proxy({}, {
      get(obj, prop) {
        if (obj[prop]) return obj[prop];
        if (prop === 'app') {
          // app
          obj[prop] = new Proxy({}, {
            get(obj, prop) {
              if (!obj[prop]) {
                if (prop === 'mini') {
                  // app.mini
                  obj[prop] = new Proxy({}, {
                    get(obj, prop) {
                      if (!obj[prop]) {
                        obj[prop] = _createWxworkApiApp({ appName: prop, mini: true });
                      }
                      return obj[prop];
                    },
                  });
                } else {
                  // others
                  obj[prop] = _createWxworkApiApp({ appName: prop });
                }
              }
              return obj[prop];
            },
          });
        } else if (prop === 'mini') {
          // mini
          obj[prop] = new Proxy({}, {
            get(obj, prop) {
              if (!obj[prop]) {
                obj[prop] = _createWxworkApiMini({ sceneShort: prop });
              }
              return obj[prop];
            },
          });
        } else if (prop === 'util') {
          // util
          obj[prop] = _createWxworkApiUtil();
        }
        return obj[prop];
      },
    });
  };

  function _createWxworkApiApp({ appName, mini }) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.wxwork;
    const configApp = mini ? config.minis[appName] : config.apps[appName];
    // api
    const api = new WxworkAPI.CorpAPI(config.corpid, configApp.secret,
      async function() {
        const cacheKey = `wxwork-token:${appName || ''}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(token) {
        const cacheKey = `wxwork-token:${appName || ''}`;
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
        const cacheKey = `wxwork-jsticket:${appName}:${type}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(type, token) {
        const cacheKey = `wxwork-jsticket:${appName}:${type}`;
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

  function _createWxworkApiMini({ sceneShort }) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.wxwork;
    const configMini = config.minis[sceneShort];
    // api
    const api = new WechatAPI(configMini.appID, configMini.appSecret,
      async function() {
        const cacheKey = `wxworkmini-token:${sceneShort}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(token) {
        const cacheKey = `wxworkmini-token:${sceneShort}`;
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
        const cacheKey = `wxworkmini-jsticket:${sceneShort}:${type}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(type, token) {
        const cacheKey = `wxworkmini-jsticket:${sceneShort}:${type}`;
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
        const cacheKey = `wxworkmini-sessionKey:${sceneShort}:${ctx.state.user.agent.id}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(sessionKey) {
        const cacheKey = `wxworkmini-sessionKey:${sceneShort}:${ctx.state.user.agent.id}`;
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, sessionKey);
      }
    );
    // ready
    return api;
  }

  function _createWxworkApiUtil() {
    return {
      // scene: empty/wxwork/wxworkweb/wxworkmini/wxworkminidefault/xxx,xxx,xxx
      in(scene) {
        // scene
        if (!scene) scene = 'wxwork';
        if (typeof scene === 'string') scene = scene.split(',');
        // provider
        const provider = ctx.state.user && ctx.state.user.provider;
        if (!provider || provider.module !== moduleInfo.relativeName) return false;
        // find any match
        for (const item of scene) {
          const ok = (provider.providerName === item) || (item === 'wxworkmini' && provider.providerName.indexOf(item) > -1);
          if (ok) return true;
        }
        // not found
        return false;
      },
    };
  }

};
