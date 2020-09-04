const require3 = require('require3');
const DingtalkAPI = require3('@zhennann/node-dingtalk');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  // ctx.bean.dingtalk.app.selfBuilt
  // ctx.bean.dingtalk.admin
  // ctx.bean.dingtalk.web.default
  // ctx.bean.dingtalk.mini.default
  // ctx.bean.dingtalk.util
  return function() {
    return new Proxy({}, {
      get(obj, prop) {
        if (obj[prop]) return obj[prop];
        if (prop === 'app') {
          // app
          obj[prop] = new Proxy({}, {
            get(obj, prop) {
              if (!obj[prop]) {
                obj[prop] = _createDingtalkApiApp({ appName: prop });
              }
              return obj[prop];
            },
          });
        } else if (prop === 'admin') {
          obj[prop] = _createDingtalkApiAdmin();
        } else if (prop === 'web') {
          // web
          obj[prop] = new Proxy({}, {
            get(obj, prop) {
              if (!obj[prop]) {
                obj[prop] = _createDingtalkApiWeb({ webName: prop });
              }
              return obj[prop];
            },
          });
        } else if (prop === 'mini') {
          // mini
          obj[prop] = new Proxy({}, {
            get(obj, prop) {
              if (!obj[prop]) {
                obj[prop] = _createDingtalkApiMini({ sceneShort: prop });
              }
              return obj[prop];
            },
          });
        } else if (prop === 'util') {
          // util
          obj[prop] = _createDingtalkApiUtil();
        }
        return obj[prop];
      },
    });
  };

  function _createDingtalkApiGeneral({ category, appName, appkey, appsecret, corpid, sso }) {
    // api
    const api = new DingtalkAPI(
      {
        appkey, appsecret, corpid, sso,
      },
      async function() {
        const cacheKey = `dingtalk-token:${category}:${appName || ''}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(token) {
        const cacheKey = `dingtalk-token:${category}:${appName || ''}`;
        if (token) {
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
        } else {
          await ctx.cache.db.module(moduleInfo.relativeName).remove(cacheKey);
        }
      }
    );
      // registerTicketHandle
    api.client.registerTicketHandle(
      async function(type) {
        const cacheKey = `dingtalk-jsticket:${category}:${appName}:${type}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(type, token) {
        const cacheKey = `dingtalk-jsticket:${category}:${appName}:${type}`;
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

  function _createDingtalkApiApp({ appName }) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
    const configApp = config.apps[appName];
    return _createDingtalkApiGeneral({
      category: 'app',
      appName,
      appkey: configApp.appkey,
      appsecret: configApp.appsecret,
      corpid: config.corpid,
    });
  }

  function _createDingtalkApiAdmin() {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
    return _createDingtalkApiGeneral({
      category: 'admin',
      appName: '',
      appkey: config.corpid,
      appsecret: config.ssosecret,
      corpid: config.corpid,
      sso: true,
    });
  }

  function _createDingtalkApiWeb({ webName }) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
    const configWeb = config.webs[webName];
    return _createDingtalkApiGeneral({
      category: 'web',
      appName: webName,
      appkey: configWeb.appid,
      appsecret: configWeb.appsecret,
      corpid: config.corpid,
    });
  }

  function _createDingtalkApiMini({ sceneShort }) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
    const configMini = config.minis[sceneShort];
    return _createDingtalkApiGeneral({
      category: 'mini',
      appName: sceneShort,
      appkey: configMini.appkey,
      appsecret: configMini.appsecret,
      corpid: config.corpid,
    });
  }

  function _createDingtalkApiUtil() {
    return {
      // scene: empty/dingtalk/dingtalkweb/dingtalkadmin/dingtalkmini/dingtalkminidefault/xxx,xxx,xxx
      in(scene) {
        // scene
        if (!scene) scene = 'dingtalk';
        if (typeof scene === 'string') scene = scene.split(',');
        // provider
        const provider = ctx.state.user && ctx.state.user.provider;
        if (!provider || provider.module !== moduleInfo.relativeName) return false;
        // find any match
        for (const item of scene) {
          const ok = (provider.providerName === item) || (item === 'dingtalkmini' && provider.providerName.indexOf(item) > -1);
          if (ok) return true;
        }
        // not found
        return false;
      },
    };
  }
};
