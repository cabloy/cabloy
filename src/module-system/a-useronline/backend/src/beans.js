const versionManager = require('./bean/version.manager.js');
const atomUserOnline = require('./bean/atom.userOnline.js');

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
  };
  return beans;
};
