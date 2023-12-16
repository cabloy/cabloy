// const moduleInfo = module.info;
module.exports = app => {
  function _createProvider() {
    return {
      meta: {
        title: 'Open Auth',
        mode: 'direct',
        scene: false,
        inner: true,
        bean: 'open',
        render: null,
        validator: null,
        icon: { f7: ':role:shield-key' },
      },
    };
  }

  const metaAuth = {
    providers: {
      authopen: _createProvider(),
    },
  };

  // ok
  return metaAuth;
};
