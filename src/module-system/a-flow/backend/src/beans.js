const versionManager = require('./bean/version.manager.js');
const atomFlowDefinition = require('./bean/atom.flowDefinition.js');
const beanFlow = require('./bean/bean.flow.js');
const beanFlowDefinition = require('./bean/bean.flowDefinition.js');

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
    // global
    flow: {
      mode: 'ctx',
      bean: beanFlow,
      global: true,
    },
    flowDefinition: {
      mode: 'ctx',
      bean: beanFlowDefinition,
      global: true,
    },
  };
  return beans;
};
