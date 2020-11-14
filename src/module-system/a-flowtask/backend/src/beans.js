const versionManager = require('./bean/version.manager.js');
const localProcedure = require('./bean/local.procedure.js');
const queueNodeDoneCheck = require('./bean/queue.nodeDoneCheck.js');
const flowNodeStartEventAtom = require('./bean/flow.node.startEventAtom.js');
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
    'queue.nodeDoneCheck': {
      mode: 'app',
      bean: queueNodeDoneCheck,
    },
    // flow
    'flow.node.startEventAtom': {
      mode: 'ctx',
      bean: flowNodeStartEventAtom,
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
