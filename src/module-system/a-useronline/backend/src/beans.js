const versionManager = require('./bean/version.manager.js');
const atomUserOnline = require('./bean/atom.userOnline.js');
const atomUserOnlineHistory = require('./bean/atom.userOnlineHistory.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.userOnline': {
      mode: 'app',
      bean: atomUserOnline,
    },
    'atom.userOnlineHistory': {
      mode: 'app',
      bean: atomUserOnlineHistory,
    },
  };
  return beans;
};
