const strategy = require('./strategy-dingtalk.js');
const DingtalkHelperFn = require('../../common/dingtalkHelper.js');
const authProviderScenes = require('../../common/authProviderScenes.js');

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  // dingtalkadmin
  function _createProviderDingtalkAdmin() {
    return {
      meta: {
        title: 'DingTalk Admin',
        mode: 'redirect',
        disableAssociate: true,
        bean: 'dingtalkadmin',
        validator: 'authDingtalkadmin',
        icon: { f7: ':auth:dingtalk-outline' },
      },
    };
  }

  function _createProviderDingTalk() {
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk.apps.selfBuilt;
    if (!config.appkey || !config.appsecret) return null;
    return {
      meta: {
        title: 'DingTalk',
        mode: 'direct',
        disableAssociate: false,
        component: 'buttondingtalk',
      },
      config: {},
      handler: null,
    };
  }

  function _createProviderDingTalkWeb() {
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk.webs.default;
    if (!config.appid || !config.appsecret) return null;
    return {
      meta: {
        title: 'DingTalk Web',
        mode: 'redirect',
        disableAssociate: false,
        component: 'buttondingtalkweb',
      },
      config: {
        client: 'dingtalkweb',
        scope: 'snsapi_login',
      },
      configFunctions: {
        getConfig(ctx) {
          const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk.webs.default;
          return { appkey: config.appid, appsecret: config.appsecret };
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
            const api = ctx.bean.dingtalk;
            api.web.default.client
              .getuserinfo_bycode(loginTmpCode)
              .then(res => {
                const unionid = res.user_info.unionid;
                api.app.selfBuilt.user
                  .getUseridByUnionid(unionid)
                  .then(res => {
                    if (res.contactType === 1) throw new Error('not support extcontact');
                    const memberId = res.userid;
                    dingtalkHelper
                      .verifyAuthUser({
                        scene: 'dingtalkweb',
                        memberId,
                        state,
                        needLogin: false,
                      })
                      .then(verifyUser => {
                        done(null, verifyUser);
                      })
                      .catch(done);
                  })
                  .catch(done);
              })
              .catch(done);
          },
        };
      },
    };
  }

  function _createProviderMini(sceneInfo, sceneShort) {
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk.minis[sceneShort];
    if (!config.appkey || !config.appsecret) return null;
    return {
      meta: {
        title: sceneInfo.title,
        mode: 'direct',
        disableAssociate: true,
      },
      config: {},
      handler: null,
    };
  }

  const metaAuth = {
    providers: {
      dingtalkadmin: _createProviderDingtalkAdmin(),
    },
  };

  // dingtalk
  metaAuth.providers.dingtalk = _createProviderDingTalk();
  // dingtalkweb
  metaAuth.providers.dingtalkweb = _createProviderDingTalkWeb();
  // dingtalkadmin
  metaAuth.providers.dingtalkadmin = _createProviderDingTalkAdmin();

  // minis
  const minis = ctx.config.module(moduleInfo.relativeName).account.dingtalk.minis;
  for (const sceneShort in minis) {
    const scene = `dingtalkmini${sceneShort}`;
    const sceneInfo = authProviderScenes.getScene(scene);
    metaAuth.providers[sceneInfo.authProvider] = _createProviderMini(sceneInfo, sceneShort);
  }

  // ok
  return metaAuth;
};
