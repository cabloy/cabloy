const versionManager = require('./bean/version.manager.js');
const atomLayout = require('./bean/atom.layout.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.layout': {
      mode: 'ctx',
      bean: atomLayout,
    },
  };
  return beans;
};
