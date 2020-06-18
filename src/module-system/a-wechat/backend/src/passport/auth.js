const require3 = require('require3');
const strategy = require3('@zhennann/passport-wechat').Strategy;
const WechatHelperFn = require('../common/wechatHelper.js');
const authProviderScenes = require('../common/authProviderScenes.js');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  function _createProvider(sceneInfo) {
    return {
      meta: {
        title: sceneInfo.title,
        mode: 'redirect',
        component: `button${sceneInfo.authProvider}`,
      },
      config: {
        appID: '',
        appSecret: '',
        client: sceneInfo.client,
        scope: 'snsapi_userinfo',
      },
      configFunctions: {
        getConfig(ctx) {
          const config = ctx.config.module(moduleInfo.relativeName).account[sceneInfo.configKey];
          return { appID: config.appID, appSecret: config.appSecret };
        },
        getToken(ctx, openid, cb) {
          const name = `wechat-webtoken:${sceneInfo.authProvider}:${openid}`;
          ctx.cache.db.module(moduleInfo.relativeName).get(name)
            .then(token => {
              cb(null, token);
            })
            .catch(cb);
        },
        saveToken(ctx, openid, token, cb) {
          const name = `wechat-webtoken:${sceneInfo.authProvider}:${openid}`;
          ctx.cache.db.module(moduleInfo.relativeName).set(name, token, (token.expires_in - 10) * 1000)
            .then(() => {
              cb(null);
            })
            .catch(cb);
        },
      },
      handler: app => {
        return {
          strategy,
          callback: (req, accessToken, refreshToken, userInfo, expires_in, done) => {
            const ctx = req.ctx;
            const state = ctx.request.query.state || 'login';
            const wechatHelper = new (WechatHelperFn(ctx))();
            wechatHelper.verifyAuthUser({
              scene: sceneInfo.scene,
              openid: userInfo.openid,
              userInfo,
              state,
              cbVerify: (profileUser, cb) => {
                app.passport.doVerify(req, profileUser, cb);
              },
            }).then(verifyUser => { done(null, verifyUser); }).catch(done);
          },
        };
      },
    };
  }

  const providerNameMini = 'wechatmini';
  const metaAuth = {
    providers: {
      [providerNameMini]: {
        meta: {
          title: 'Wechat Miniprogram',
          mode: 'direct',
          disableAssociate: true,
        },
        config: {
        },
        handler: null,
      },
    },
  };
  // wechat/wechatweb
  for (const scene of [ 1, 3 ]) {
    const sceneInfo = authProviderScenes.getScene(scene);
    metaAuth.providers[sceneInfo.authProvider] = _createProvider(sceneInfo);
  }
  // ok
  return metaAuth;
};
