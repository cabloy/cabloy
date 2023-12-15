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
    mode: 'app',
    bean: versionManager,
  },
  // atom
  'atom.flowDef': {
    bean: atomFlowDef,
  },
  // flow behavior
  'flow.behavior.base': {
    mode: 'ctx',
    bean: flowBehaviorBase,
  },
  // local
  'local.context.flow': {
    mode: 'ctx',
    bean: localContextFlow,
  },
  'local.context.node': {
    mode: 'ctx',
    bean: localContextNode,
  },
  'local.context.edge': {
    mode: 'ctx',
    bean: localContextEdge,
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
  'local.flow.listener': {
    mode: 'ctx',
    bean: localFlowListener,
  },
  'local.procedure': {
    mode: 'ctx',
    bean: localProcedure,
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
  // stats
  'stats.flowInitiateds': {
    mode: 'ctx',
    bean: statsFlowInitiateds,
  },
};
