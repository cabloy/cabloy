const strategy = require('./strategy-dingtalk.js');
const DingtalkHelperFn = require('../common/dingtalkHelper.js');
const authProviderScenes = require('../common/authProviderScenes.js');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  function _createProviderDingTalk() {
    return {
      meta: {
        title: 'DingTalk',
        mode: 'direct',
        disableAssociate: true,
        component: 'buttondingtalk',
      },
      config: {
      },
      handler: null,
    };
  }

  function _createProviderDingTalkWeb() {
    return {
      meta: {
        title: 'DingTalk Web',
        mode: 'redirect',
        disableAssociate: true,
        component: 'buttondingtalkweb',
      },
      config: {
        client: 'dingtalkweb',
        scope: 'snsapi_login',
      },
      configFunctions: {
        getConfig(ctx) {
          const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk.webs.default;
          return { appkey: config.appkey, appsecret: config.appsecret };
        },
      },
      handler: app => {
        return {
          strategy,
          callback: (req, loginTmpCode, done) => {
            // ctx/state
            const ctx = req.ctx;
            const state = ctx.request.query.state || 'login';
            // code/memberId
            const dingtalkHelper = new (DingtalkHelperFn(ctx))();
            const api = dingtalkHelper.createDingtalkApi();
            api.web.default.getuserinfo_bycode(loginTmpCode).then(res => {
              const unionid = res.user_info.unionid;
              api.app.selfBuilt.user.getUseridByUnionid(unionid).then(res => {
                if (res.contactType === 1) throw new Error('not support extcontact');
                const memberId = res.userid;
                dingtalkHelper.verifyAuthUser({
                  scene: 'dingtalkweb',
                  memberId,
                  state,
                  cbVerify: (profileUser, cb) => {
                    app.passport.doVerify(req, profileUser, cb);
                  },
                }).then(verifyUser => { done(null, verifyUser); }).catch(done);
              }).catch(done);
            }).catch(done);
          },
        };
      },
    };
  }

  function _createProviderDingTalkAdmin() {
    return {
      meta: {
        title: 'DingTalk Admin',
        mode: 'redirect',
        disableAssociate: true,
      },
      config: {
      },
      configFunctions: {
        getConfig(ctx) {
          const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
          return { appkey: config.corpid, appsecret: config.ssosecret };
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
            const dingtalkHelper = new (DingtalkHelperFn(ctx))();
            const api = dingtalkHelper.createDingtalkApi();
            api.admin.getSSOUserInfo(null, code).then(res => {
              const memberId = res.user_info.userid;
              dingtalkHelper.verifyAuthUser({
                scene: 'dingtalkwebadmin',
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

  // dingtalk
  metaAuth.providers.dingtalk = _createProviderDingTalk();
  // dingtalkweb
  metaAuth.providers.dingtalkweb = _createProviderDingTalkWeb();
  // dingtalkadmin
  metaAuth.providers.dingtalkadmin = _createProviderDingTalkAdmin();

  // minis
  const moduleConfig = app.meta.configs[moduleInfo.relativeName];
  const minis = moduleConfig.account.dingtalk.minis;
  for (const sceneShort in minis) {
    const scene = `dingtalkmini${sceneShort}`;
    const sceneInfo = authProviderScenes.getScene(scene);
    metaAuth.providers[sceneInfo.authProvider] = _createProviderMini(sceneInfo);
  }

  // ok
  return metaAuth;
};
