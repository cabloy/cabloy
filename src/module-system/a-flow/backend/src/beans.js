const versionManager = require('./bean/version.manager.js');
const atomFlowDef = require('./bean/atom.flowDef.js');
const beanFlow = require('./bean/bean.flow.js');
const beanFlowDef = require('./bean/bean.flowDef.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.flowDef': {
      mode: 'app',
      bean: atomFlowDef,
    },
    // global
    flow: {
      mode: 'ctx',
      bean: beanFlow,
      global: true,
    },
    flowDef: {
      mode: 'ctx',
      bean: beanFlowDef,
      global: true,
    },
  };
  return beans;
};
