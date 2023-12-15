const versionManager = require('./bean/version.manager.js');
const queueStartEventTimer = require('./bean/queue.startEventTimer.js');
const flowEdgeSequence = require('./bean/flow.edge.sequence.js');
const flowNodeStartEventNone = require('./bean/flow.node.startEventNone.js');
const flowNodeStartEventTimer = require('./bean/flow.node.startEventTimer.js');
const flowNodeEndEventNone = require('./bean/flow.node.endEventNone.js');
const flowNodeActivityNone = require('./bean/flow.node.activityNone.js');
const flowNodeActivityService = require('./bean/flow.node.activityService.js');

module.exports = {
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
};
