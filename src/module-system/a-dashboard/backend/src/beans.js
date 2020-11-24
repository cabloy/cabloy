const versionManager = require('./bean/version.manager.js');
const atomProfile = require('./bean/atom.profile.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.profile': {
      mode: 'app',
      bean: atomProfile,
    },
  };
  return beans;
};
