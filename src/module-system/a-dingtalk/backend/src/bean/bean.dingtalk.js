const require3 = require('require3');
const DingtalkFn = require3('@zhennann/node-dingtalk');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  function getCacheDb() {
    return ctx.cache.db.module(moduleInfo.relativeName);
  }
  // bean.dingtalk.admin
  // bean.dingtalk.app.{providerScene}
  // bean.dingtalk.mini.{providerScene}
  // bean.dingtalk.util
  return function () {
    return new Proxy(
      {},
      {
        get(obj, prop) {
          if (obj[prop]) return obj[prop];
          if (prop === 'admin') {
            obj[prop] = _createDingtalkApiAdmin();
          } else if (prop === 'app') {
            // app
            obj[prop] = new Proxy(
              {},
              {
                get(obj, prop) {
                  if (!obj[prop]) {
                    obj[prop] = _createDingtalkApiApp({ providerScene: prop });
                  }
                  return obj[prop];
                },
              }
            );
          } else if (prop === 'mini') {
            // mini
            obj[prop] = new Proxy(
              {},
              {
                get(obj, prop) {
                  if (!obj[prop]) {
                    obj[prop] = _createDingtalkApiMini({ providerScene: prop });
                  }
                  return obj[prop];
                },
              }
            );
          } else if (prop === 'util') {
            // util
            obj[prop] = _createDingtalkApiUtil();
          }
          return obj[prop];
        },
      }
    );
  };

  function _createDingtalkApiGeneral({ providerName, providerScene, sso }) {
    // bean provider
    const beanProvider = ctx.bean.authProvider.createAuthProviderBean({
      module: moduleInfo.relativeName,
      providerName,
      providerScene,
    });
    if (!beanProvider.providerSceneValid) ctx.throw(423);
    // config
    const config = beanProvider.configProviderScene;
    // api
    const api = DingtalkFn(
      {
        appKey: sso ? config.corpId : config.appKey,
        appSecret: sso ? config.ssoSecret : config.appSecret,
        corpId: config.corpId,
        sso,
      },
      async function () {
        const cacheKey = `dingtalk-token:${providerName}:${providerScene || ''}`;
        return await getCacheDb().get(cacheKey);
      },
      async function (token) {
        const cacheKey = `dingtalk-token:${providerName}:${providerScene || ''}`;
        if (token) {
          await getCacheDb().set(cacheKey, token, token.expireTime - Date.now());
        } else {
          await getCacheDb().remove(cacheKey);
        }
      }
    );
    // registerTicketHandle
    api.client.registerTicketHandle(
      async function (type) {
        const cacheKey = `dingtalk-jsticket:${providerName}:${providerScene || ''}:${type}`;
        return await getCacheDb().get(cacheKey);
      },
      async function (type, token) {
        const cacheKey = `dingtalk-jsticket:${providerName}:${providerScene || ''}:${type}`;
        if (token) {
          await getCacheDb().set(cacheKey, token, token.expireTime - Date.now());
        } else {
          await getCacheDb().remove(cacheKey);
        }
      }
    );
    // ready
    return api;
  }

  function _createDingtalkApiApp({ providerScene }) {
    return _createDingtalkApiGeneral({
      providerName: 'dingtalk',
      providerScene,
    });
  }

  function _createDingtalkApiAdmin() {
    return _createDingtalkApiGeneral({
      providerName: 'dingtalkadmin',
      providerScene: null,
      sso: true,
    });
  }

  function _createDingtalkApiMini({ providerScene }) {
    return _createDingtalkApiGeneral({
      providerName: 'dingtalkmini',
      providerScene,
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
          const ok =
            provider.providerName === item || (item === 'dingtalkmini' && provider.providerName.indexOf(item) > -1);
          if (ok) return true;
        }
        // not found
        return false;
      },
    };
  }
};
