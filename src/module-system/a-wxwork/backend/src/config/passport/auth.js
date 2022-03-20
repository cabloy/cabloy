module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  // wxwork
  function _createProviderWxwork() {
    return {
      meta: {
        title: 'Wechat Work',
        mode: 'redirect',
        disableAssociate: false,
        bean: 'wxwork',
        render: 'buttonWxwork',
        validator: 'authWxwork',
      },
    };
  }

  function _createProviderMini(sceneInfo, sceneShort) {
    const config = ctx.config.module(moduleInfo.relativeName).account.wxwork.minis[sceneShort];
    if (!config.appID || !config.appSecret) return null;
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
      wxwork: _createProviderWxwork(),
      // wxworkweb: _createProviderWxworkweb(),
      // wxworkmini: _createProviderWxworkmini(),
    },
  };

  // ok
  return metaAuth;
};
