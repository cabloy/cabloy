const atomAppMenu = require('./bean/atom.appMenu.js');
const versionManager = require('./bean/version.manager.js');
const atomApp = require('./bean/atom.app.js');

module.exports = app => {
  const beans = {
    // atom
    'atom.appMenu': {
      mode: 'app',
      bean: atomAppMenu,
    },
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.app': {
      mode: 'app',
      bean: atomApp,
    },
  };
  return beans;
};
