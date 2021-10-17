const versionManager = require('./bean/version.manager.js');
const atomDict = require('./bean/atom.dict.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.dict': {
      mode: 'app',
      bean: atomDict,
    },
  };
  return beans;
};
