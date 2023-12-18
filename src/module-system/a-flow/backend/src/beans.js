const versionManager = require('./bean/version.manager.js');
const atomFlowDef = require('./bean/atom.flowDef.js');
const flowBehaviorBase = require('./bean/flow.behavior.base.js');
const localContextFlow = require('./bean/local.context.flow.js');
const localContextNode = require('./bean/local.context.node.js');
const localContextEdge = require('./bean/local.context.edge.js');
const localFlowFlow = require('./bean/local.flow.flow.js');
const localFlowNode = require('./bean/local.flow.node.js');
const localFlowEdge = require('./bean/local.flow.edge.js');
const localFlowListener = require('./bean/local.flow.listener.js');
const localProcedure = require('./bean/local.procedure.js');
const beanFlow = require('./bean/bean.flow.js');
const beanFlowDef = require('./bean/bean.flowDef.js');
const statsFlowInitiateds = require('./bean/stats.flowInitiateds.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // atom
  'atom.flowDef': {
    bean: atomFlowDef,
  },
  // flow behavior
  'flow.behavior.base': {
    bean: flowBehaviorBase,
  },
  // local
  'local.context.flow': {
    bean: localContextFlow,
  },
  'local.context.node': {
    bean: localContextNode,
  },
  'local.context.edge': {
    bean: localContextEdge,
  },
  'local.flow.flow': {
    bean: localFlowFlow,
  },
  'local.flow.node': {
    bean: localFlowNode,
  },
  'local.flow.edge': {
    bean: localFlowEdge,
  },
  'local.flow.listener': {
    bean: localFlowListener,
  },
  'local.procedure': {
    bean: localProcedure,
  },
  // global
  flow: {
    bean: beanFlow,
    global: true,
  },
  flowDef: {
    bean: beanFlowDef,
    global: true,
  },
  // stats
  'stats.flowInitiateds': {
    bean: statsFlowInitiateds,
  },
};
