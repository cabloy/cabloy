const versionManager = require('./bean/version.manager.js');
const flowNodeStartEventAtom = require('./bean/flow.node.startEventAtom.js');
const flowNodeActivityUserTask = require('./bean/flow.node.activityUserTask.js');
const localContextTask = require('./bean/local.context.task.js');
const localFlowTask = require('./bean/local.flow.task.js');
const localProcedure = require('./bean/local.procedure.js');
const beanFlowTask = require('./bean/bean.flowTask.js');
const statsTaskClaimings = require('./bean/stats.taskClaimings.js');
const statsTaskHandlings = require('./bean/stats.taskHandlings.js');
const ioMessageWorkflow = require('./bean/io.message.workflow.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
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
    // local
    'local.context.task': {
      mode: 'ctx',
      bean: localContextTask,
    },
    'local.flow.task': {
      mode: 'ctx',
      bean: localFlowTask,
    },
    'local.procedure': {
      mode: 'ctx',
      bean: localProcedure,
    },
    // global
    flowTask: {
      mode: 'ctx',
      bean: beanFlowTask,
      global: true,
    },
    // stats
    'stats.taskClaimings': {
      mode: 'ctx',
      bean: statsTaskClaimings,
    },
    'stats.taskHandlings': {
      mode: 'ctx',
      bean: statsTaskHandlings,
    },
    // io
    'io.message.workflow': {
      mode: 'ctx',
      bean: ioMessageWorkflow,
    },
  };
  return beans;
};
