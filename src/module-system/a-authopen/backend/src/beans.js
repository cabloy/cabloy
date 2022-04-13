const versionManager = require('./bean/version.manager.js');
const atomAuthOpen = require('./bean/atom.authOpen.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.authOpen': {
      mode: 'app',
      bean: atomAuthOpen,
    },
  };
  return beans;
};
