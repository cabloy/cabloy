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

  // dingtalkmini
  function _createProviderDingtalkmini() {
    return {
      meta: {
        title: 'DingTalk Miniprogram',
        mode: 'direct',
        scene: true,
        disableAssociate: true,
        bean: 'dingtalkmini',
        validator: 'authDingtalkmini',
        icon: { f7: ':auth:dingtalk-square' },
      },
    };
  }

  const metaAuth = {
    providers: {
      dingtalkadmin: _createProviderDingtalkAdmin(),
      dingtalk: _createProviderDingtalk(),
      dingtalkweb: _createProviderDingtalkweb(),
      dingtalkmini: _createProviderDingtalkmini(),
    },
  };

  // ok
  return metaAuth;
};
