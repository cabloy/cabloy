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
        icon: { f7: ':auth:dingtalk-square' },
      },
    };
  }

  // dingtalk
  function _createProviderDingtalk() {
    return {
      meta: {
        title: 'DingTalk',
        mode: 'direct',
        scene: true,
        inner: true,
        disableAssociate: true,
        bean: 'dingtalk',
        render: null,
        validator: 'json',
        icon: { f7: ':auth:dingtalk-square' },
      },
      scenes: {
        selfBuilt: {
          meta: {
            mode: 'direct',
            inner: false,
            disableAssociate: false,
            render: 'buttonDingtalk',
            validator: 'authDingtalkSelfBuilt',
          },
        },
      },
    };
  }

  // dingtalkweb
  function _createProviderDingtalkweb() {
    return {
      meta: {
        title: 'DingTalk Web',
        mode: 'redirect',
        scene: true,
        disableAssociate: false,
        bean: 'dingtalkweb',
        render: 'buttonDingtalkweb',
        icon: { f7: ':auth:dingtalk-square' },
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
      dingtalk: _createProviderDingtalk(),
      dingtalkweb: _createProviderDingtalkweb(),
    },
  };

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
