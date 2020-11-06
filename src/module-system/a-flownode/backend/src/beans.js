const versionManager = require('./bean/version.manager.js');
const queueStartEventTimer = require('./bean/queue.startEventTimer.js');
const flowEdgeSequence = require('./bean/flow.edge.sequence.js');
const flowNodeStartEventNone = require('./bean/flow.node.startEventNone.js');
const flowNodeStartEventTimer = require('./bean/flow.node.startEventTimer.js');
const flowNodeStartEventAtom = require('./bean/flow.node.startEventAtom.js');
const flowNodeEndEventNone = require('./bean/flow.node.endEventNone.js');
const flowNodeActivityNone = require('./bean/flow.node.activityNone.js');
const flowNodeActivityService = require('./bean/flow.node.activityService.js');
const flowNodeActivityUserTask = require('./bean/flow.node.activityUserTask.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // queue
    'queue.startEventTimer': {
      mode: 'app',
      bean: queueStartEventTimer,
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
  };
  return beans;
};
