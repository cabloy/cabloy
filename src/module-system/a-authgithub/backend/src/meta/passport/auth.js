// const moduleInfo = module.info;

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
module.exports = metaAuth;
