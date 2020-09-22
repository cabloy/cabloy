const versionManager = require('./bean/version.manager.js');
const atomFlowDefinition = require('./bean/atom.flowDefinition.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.flowDefinition': {
      mode: 'app',
      bean: atomFlowDefinition,
    },
  };
  return beans;
};
