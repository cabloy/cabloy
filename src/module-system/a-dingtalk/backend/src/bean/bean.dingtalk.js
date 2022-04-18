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
    const appName = `${providerName}:${providerScene || ''}`;
    // bean provider
    const beanProvider = ctx.bean.authProvider.createAuthProviderBean({
      module: moduleInfo.relativeName,
      providerName,
      providerScene,
    });
    if (!beanProvider.providerSceneValid) ctx.throw.module('a-base', 1015);
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
        const cacheKey = `dingtalk-token:${appName}`;
        return await getCacheDb().get(cacheKey);
      },
      async function (token) {
        const cacheKey = `dingtalk-token:${appName}`;
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
        const cacheKey = `dingtalk-jsticket:${appName}:${type}`;
        return await getCacheDb().get(cacheKey);
      },
      async function (type, token) {
        const cacheKey = `dingtalk-jsticket:${appName}:${type}`;
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
      // providerScene: empty/dingtalk/dingtalkweb/dingtalkadmin/dingtalkmini/xxx,xxx,xxx
      in({ providerName, providerScene }) {
        //  providerName is dingtalk/selfBuilt
        if (!providerName && !providerScene) {
          providerName = 'dingtalk';
          providerScene = 'selfBuilt';
        }
        // 1. provider
        const provider = ctx.state.user && ctx.state.user.provider;
        if (!provider || provider.module !== moduleInfo.relativeName) return false;
        // 2. dingtalkadmin
        if (['dingtalkadmin'].includes(providerName) && provider.providerName === providerName) return true;
        // 3. dingtalk/dingtalkweb/dingtalkmini
        if (
          !['dingtalk', 'dingtalkweb', 'dingtalkmini'].includes(providerName) ||
          provider.providerName !== providerName
        ) {
          return false;
        }
        // 4. null means all
        if (!providerScene || providerScene === provider.providerScene) return true;
        // 4.2 some scenes
        if (!Array.isArray(providerScene)) providerScene = providerScene.split(',');
        return providerScene.includes(provider.providerScene);
      },
    };
  }
};
