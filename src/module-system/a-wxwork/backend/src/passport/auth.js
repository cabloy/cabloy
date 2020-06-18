const strategy = require('./strategy-wxwork.js');
const WxworkHelperFn = require('../common/wxworkHelper.js');
const authProviderScenes = require('../common/authProviderScenes.js');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  function _createProvider(sceneInfo) {
    return {
      meta: {
        title: sceneInfo.title,
        mode: 'redirect',
        disableAssociate: true,
        component: `button${sceneInfo.authProvider}`,
      },
      config: {
        corpid: '',
        agentid: '',
        client: sceneInfo.client,
        scope: 'snsapi_base',
      },
      configFunctions: {
        getConfig(ctx) {
          const config = ctx.config.module(moduleInfo.relativeName).account.wxwork;
          return { corpid: config.corpid, agentid: config.apps.selfBuilt.agentid };
        },
      },
      handler: app => {
        return {
          strategy,
          callback: (req, code, done) => {
            // ctx/state
            const ctx = req.ctx;
            const state = ctx.request.query.state || 'login';
            // code/memberId
            const wxworkHelper = new (WxworkHelperFn(ctx))();
            const api = wxworkHelper.createWxworkApi();
            api.app.selfBuilt.getUserIdByCode(code).then(res => {
              if (res.errcode) throw new Error(res.errmsg);
              const memberId = res.UserId;
              wxworkHelper.verifyAuthUser({
                scene: sceneInfo.scene,
                memberId,
                state,
                cbVerify: (profileUser, cb) => {
                  app.passport.doVerify(req, profileUser, cb);
                },
              }).then(verifyUser => { done(null, verifyUser); }).catch(done);
            }).catch(done);
          },
        };
      },
    };
  }

  const providerNameMini = 'wxworkmini';
  const metaAuth = {
    providers: {
      [providerNameMini]: {
        meta: {
          title: 'Wechat Work Miniprogram',
          mode: 'direct',
          disableAssociate: true,
        },
        config: {
        },
        handler: null,
      },
    },
  };
  // wxwork/wxworkweb
  for (const scene of [ 1, 3 ]) {
    const sceneInfo = authProviderScenes.getScene(scene);
    metaAuth.providers[sceneInfo.authProvider] = _createProvider(sceneInfo);
  }
  // ok
  return metaAuth;
};
