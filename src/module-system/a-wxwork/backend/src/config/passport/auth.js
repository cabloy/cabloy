module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  // wxwork
  function _createProviderWxwork() {
    return {
      meta: {
        title: 'Wechat Work',
        mode: 'redirect',
        scene: true,
        disableAssociate: false,
        bean: 'wxwork',
        render: 'buttonWxwork',
        validator: 'authWxwork',
      },
    };
  }

  // wxworkweb
  function _createProviderWxworkweb() {
    return {
      meta: {
        title: 'Wechat Work Web',
        mode: 'redirect',
        scene: true,
        disableAssociate: false,
        bean: 'wxworkweb',
        render: 'buttonWxworkweb',
      },
    };
  }

  // wxworkmini
  function _createProviderWxworkmini() {
    return {
      meta: {
        title: 'Wechat Work Miniprogram',
        mode: 'direct',
        scene: true,
        disableAssociate: true,
        bean: 'wxworkmini',
        validator: 'authWxworkmini',
      },
    };
  }

  const metaAuth = {
    providers: {
      wxwork: _createProviderWxwork(),
      wxworkweb: _createProviderWxworkweb(),
      wxworkmini: _createProviderWxworkmini(),
    },
  };

  // ok
  return metaAuth;
};
