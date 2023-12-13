const versionManager = require('./bean/version.manager.js');
const atomApp = require('./bean/atom.app.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.app': {
      bean: atomApp,
    },
  };
  return beans;
};
