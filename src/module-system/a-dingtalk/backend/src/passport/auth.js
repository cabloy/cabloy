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

  function _createProviderMini(sceneInfo) {
    return {
      meta: {
        title: sceneInfo.title,
        mode: 'direct',
        disableAssociate: true,
      },
      config: {
      },
      handler: null,
    };
  }

  const metaAuth = {
    providers: {
    },
  };

  // wxwork/wxworkweb
  for (const scene of [ 'wxwork', 'wxworkweb' ]) {
    const sceneInfo = authProviderScenes.getScene(scene);
    metaAuth.providers[sceneInfo.authProvider] = _createProvider(sceneInfo);
  }

  // minis
  const moduleConfig = app.meta.configs[moduleInfo.relativeName];
  const minis = moduleConfig.account.wxwork.minis;
  for (const sceneShort in minis) {
    const scene = `wxworkmini${sceneShort}`;
    const sceneInfo = authProviderScenes.getScene(scene);
    metaAuth.providers[sceneInfo.authProvider] = _createProviderMini(sceneInfo);
  }

  // ok
  return metaAuth;
};
