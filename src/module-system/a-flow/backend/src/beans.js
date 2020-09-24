const versionManager = require('./bean/version.manager.js');
const atomFlowDef = require('./bean/atom.flowDef.js');
const localFlowContext = require('./bean/local.flow.context.js');
const localFlowFlow = require('./bean/local.flow.flow.js');
const localFlowNode = require('./bean/local.flow.node.js');
const localFlowEdge = require('./bean/local.flow.edge.js');
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
    // local
    'local.flow.context': {
      mode: 'ctx',
      bean: localFlowContext,
    },
    'local.flow.flow': {
      mode: 'ctx',
      bean: localFlowFlow,
    },
    'local.flow.node': {
      mode: 'ctx',
      bean: localFlowNode,
    },
    'local.flow.edge': {
      mode: 'ctx',
      bean: localFlowEdge,
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
