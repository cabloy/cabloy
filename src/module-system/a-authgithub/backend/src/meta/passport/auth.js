module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  function _createProvider() {
    return {
      meta: {
        title: 'GitHub',
        mode: 'redirect',
        scene: true,
        bean: 'github',
        render: 'buttonGithub',
        validator: {
          module: 'a-auth',
          validator: 'oauth2',
        },
        icon: { f7: ':auth:github' },
      },
    };
  }

  const metaAuth = {
    providers: {
      authgithub: _createProvider(),
    },
  };

  // ok
  return metaAuth;
};
