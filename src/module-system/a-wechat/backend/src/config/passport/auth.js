module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  // wechat
  function _createProviderWechat() {
    return {
      meta: {
        title: 'Wechat Public',
        mode: 'redirect',
        bean: {
          module: moduleInfo.relativeName,
          name: 'wechat',
        },
        render: {
          module: moduleInfo.relativeName,
          name: 'buttonWechat',
        },
        validator: {
          module: moduleInfo.relativeName,
          validator: 'authWechat',
        },
      },
    };
  }

  // wechatweb
  function _createProviderWechatweb() {
    return {
      meta: {
        title: 'Wechat Web',
        mode: 'redirect',
        bean: {
          module: moduleInfo.relativeName,
          name: 'wechatweb',
        },
        render: {
          module: moduleInfo.relativeName,
          name: 'buttonWechatweb',
        },
        validator: {
          module: moduleInfo.relativeName,
          validator: 'authWechatweb',
        },
      },
    };
  }

  // wechatmini
  function _createProviderWechatmini() {
    return {
      meta: {
        title: 'Wechat Miniprogram',
        mode: 'direct',
        scene: true,
        disableAssociate: true,
        bean: {
          module: moduleInfo.relativeName,
          name: 'wechatmini',
        },
        validator: {
          module: moduleInfo.relativeName,
          validator: 'authWechatmini',
        },
      },
    };
  }

  const metaAuth = {
    providers: {
      wechat: _createProviderWechat(),
      wechatweb: _createProviderWechatweb(),
      wechatmini: _createProviderWechatmini(),
    },
  };

  // ok
  return metaAuth;
};
