module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  function _createProvider() {
    return {
      meta: {
        title: 'GitHub',
        mode: 'redirect',
        scene: true,
        bean: {
          module: moduleInfo.relativeName,
          name: 'github',
        },
        render: {
          module: moduleInfo.relativeName,
          name: 'buttonGithub',
        },
        validator: {
          module: moduleInfo.relativeName,
          validator: 'authGithub',
        },
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
