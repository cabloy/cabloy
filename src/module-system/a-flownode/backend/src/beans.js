const versionManager = require('./bean/version.manager.js');
const localProcedure = require('./bean/local.procedure.js');
const queueStartEventTimer = require('./bean/queue.startEventTimer.js');
const queueFlowCheck = require('./bean/queue.flowCheck.js');
const flowEdgeSequence = require('./bean/flow.edge.sequence.js');
const flowNodeStartEventNone = require('./bean/flow.node.startEventNone.js');
const flowNodeStartEventTimer = require('./bean/flow.node.startEventTimer.js');
const flowNodeStartEventAtom = require('./bean/flow.node.startEventAtom.js');
const flowNodeEndEventNone = require('./bean/flow.node.endEventNone.js');
const flowNodeActivityNone = require('./bean/flow.node.activityNone.js');
const flowNodeActivityService = require('./bean/flow.node.activityService.js');
const flowNodeActivityUserTask = require('./bean/flow.node.activityUserTask.js');
const localContextTask = require('./bean/local.context.task.js');
const localFlowTask = require('./bean/local.flow.task.js');
const beanFlowTask = require('./bean/bean.flowTask.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // local
    'local.procedure': {
      mode: 'ctx',
      bean: localProcedure,
    },
    // queue
    'queue.startEventTimer': {
      mode: 'app',
      bean: queueStartEventTimer,
    },
    'queue.flowCheck': {
      mode: 'app',
      bean: queueFlowCheck,
    },
    // flow
    'flow.edge.sequence': {
      mode: 'ctx',
      bean: flowEdgeSequence,
    },
    'flow.node.startEventNone': {
      mode: 'ctx',
      bean: flowNodeStartEventNone,
    },
    'flow.node.startEventTimer': {
      mode: 'ctx',
      bean: flowNodeStartEventTimer,
    },
    'flow.node.startEventAtom': {
      mode: 'ctx',
      bean: flowNodeStartEventAtom,
    },
    'flow.node.endEventNone': {
      mode: 'ctx',
      bean: flowNodeEndEventNone,
    },
    'flow.node.activityNone': {
      mode: 'ctx',
      bean: flowNodeActivityNone,
    },
    'flow.node.activityService': {
      mode: 'ctx',
      bean: flowNodeActivityService,
    },
    'flow.node.activityUserTask': {
      mode: 'ctx',
      bean: flowNodeActivityUserTask,
    },
    'local.context.task': {
      mode: 'ctx',
      bean: localContextTask,
    },
    'local.flow.task': {
      mode: 'ctx',
      bean: localFlowTask,
    },
    // global
    flowTask: {
      mode: 'ctx',
      bean: beanFlowTask,
      global: true,
    },
  };
  return beans;
};
