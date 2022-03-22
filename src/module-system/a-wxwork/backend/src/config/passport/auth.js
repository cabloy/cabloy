module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  // wxwork
  function _createProviderWxwork() {
    return {
      meta: {
        title: 'Wechat Work',
        mode: 'direct',
        scene: true,
        inner: true,
        disableAssociate: true,
        bean: 'wxwork',
        render: null,
        validator: 'json',
        icon: { f7: ':auth:wxwork-outline' },
      },
      scenes: {
        selfBuilt: {
          meta: {
            mode: 'redirect',
            inner: false,
            disableAssociate: false,
            render: 'buttonWxwork',
            validator: 'authWxworkSelfBuilt',
          },
        },
        contacts: {
          meta: {
            validator: 'authWxworkSelfBuilt',
          },
        },
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
        icon: { f7: ':auth:wxwork-outline' },
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
        icon: { f7: ':auth:wxwork-outline' },
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
