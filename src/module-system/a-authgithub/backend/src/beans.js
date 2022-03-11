const versionManager = require('./bean/version.manager.js');
const authProviderGithub = require('./bean/auth.provider.github.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // auth.provider
    'auth.provider.github': {
      mode: 'ctx',
      bean: authProviderGithub,
    },
  };
  return beans;
};
