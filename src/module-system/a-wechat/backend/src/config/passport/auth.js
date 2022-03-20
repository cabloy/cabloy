module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  // wechat
  function _createProviderWechat() {
    return {
      meta: {
        title: 'Wechat Public',
        mode: 'redirect',
        bean: 'wechat',
        render: 'buttonWechat',
        validator: 'authWechat',
      },
    };
  }

  // wechatweb
  function _createProviderWechatweb() {
    return {
      meta: {
        title: 'Wechat Web',
        mode: 'redirect',
        bean: 'wechatweb',
        render: 'buttonWechatweb',
        validator: 'authWechatweb',
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
        bean: 'wechatmini',
        validator: 'authWechatmini',
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
